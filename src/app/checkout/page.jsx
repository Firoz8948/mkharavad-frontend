"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Loader from "@/components/Loader/Loader";
import LoginModal from "@/components/LoginModal/LoginModal";
import { AddressForm, OrderSummary, PaymentSection } from "@/pages-components/checkout";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { updateProfile } from "@/services/authService";
import { orderService } from "@/services/orderService";
import { paymentService } from "@/services/paymentService";
import { BRAND } from "@/utils/constants";
import { isValidPincode, required } from "@/utils/validators";
import styles from "./checkout.module.css";

const emptyForm = {
  full_name: "",
  phone: "",
  email: "",
  line1: "",
  line2: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

function formFromUser(user) {
  if (!user) return emptyForm;
  return {
    full_name: user.name || "",
    phone: user.phone || "",
    email: user.email || "",
    line1: user.address_line1 || "",
    line2: user.address_line2 || "",
    landmark: user.address_landmark || "",
    city: user.address_city || "",
    state: user.address_state || "",
    pincode: user.address_pincode || "",
    country: "India",
  };
}

function hasSavedAddress(user) {
  return !!(user?.address_line1 && user?.address_pincode);
}

async function saveAddressToProfile(form) {
  try {
    await updateProfile({
      name: form.full_name?.trim() || undefined,
      address_line1: form.line1?.trim() || "",
      address_line2: form.line2?.trim() || "",
      address_landmark: form.landmark?.trim() || "",
      address_city: form.city?.trim() || "",
      address_state: form.state?.trim() || "",
      address_pincode: form.pincode?.trim() || "",
    });
  } catch {
    // Non-blocking — order already succeeded
  }
}

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function buildCheckoutPayload(cart, form, promoCode) {
  return {
    customer: {
      name: form.full_name,
      mobile: form.phone,
      email: form.email || null,
    },
    address: {
      line1: form.line1,
      line2: form.line2 || null,
      landmark: form.landmark || null,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      country: form.country,
    },
    items: cart.items.map((item) => ({
      product_id: item.product_id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      weight: item.weight,
      weight_grams: item.weight_grams,
      variant_info: item.variant_info,
    })),
    promo_code: promoCode || null,
  };
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, loading: cartLoading, clearCart } = useCart();
  const { isAuthenticated, user, loading: authLoading, refresh } = useAuth();

  const [form, setForm] = useState(emptyForm);
  const [method, setMethod] = useState("razorpay");
  const [placing, setPlacing] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [promo, setPromo] = useState(null);
  const prefilledRef = useRef(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLoginOpen(true);
    }
  }, [authLoading, isAuthenticated]);

  // Always fetch latest profile (with saved address) when entering checkout
  useEffect(() => {
    if (isAuthenticated) {
      prefilledRef.current = false;
      refresh();
    }
  }, [isAuthenticated, refresh]);

  // Prefill once when profile data is available
  useEffect(() => {
    if (!user || prefilledRef.current) return;
    setForm(formFromUser(user));
    if (hasSavedAddress(user) || user.phone || user.name) {
      prefilledRef.current = true;
    }
  }, [user]);

  const handleAddNewAddress = () => {
    prefilledRef.current = true;
    setForm({
      ...emptyForm,
      full_name: form.full_name || user?.name || "",
      phone: user?.phone || form.phone || "",
      email: form.email || "",
    });
  };

  const validateForm = () => {
    const requiredFields = ["full_name", "phone", "line1", "city", "state", "pincode"];
    for (const f of requiredFields) {
      if (!required(form[f])) {
        toast.error("Please fill in all required fields");
        return false;
      }
    }
    if (!isValidPincode(form.pincode)) {
      toast.error("Enter a valid 6-digit pincode");
      return false;
    }
    return true;
  };

  const handleRazorpay = async () => {
    const config = await paymentService.getConfig();
    if (!config?.configured) {
      toast.error(
        "Online payment is not configured yet. Please use COD or contact the store."
      );
      return;
    }

    const ok = await loadRazorpay();
    if (!ok) {
      toast.error("Failed to load payment gateway");
      return;
    }

    const payload = buildCheckoutPayload(cart, form, promo?.code);
    const data = await paymentService.createOrder(payload);

    const options = {
      key: data.key_id || config.key_id,
      amount: data.amount,
      currency: data.currency,
      name: BRAND.name,
      description: "Iron cookware order",
      order_id: data.razorpay_order_id,
      prefill: {
        name: form.full_name,
        contact: form.phone,
        email: form.email || "",
      },
      theme: { color: "#F26A21" },
      handler: async (response) => {
        try {
          const result = await paymentService.verify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          await saveAddressToProfile(form);
          await refresh();
          clearCart();
          toast.success("Payment successful!");
          router.push(`/orders?order=${result.order_id}`);
        } catch (err) {
          toast.error(err.message || "Payment verification failed");
        }
      },
      modal: {
        ondismiss: () => toast("Payment cancelled", { icon: "⚠️" }),
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (response) => {
      const desc =
        response?.error?.description ||
        response?.error?.reason ||
        "Payment failed";
      toast.error(desc);
    });
    rzp.open();
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      setLoginOpen(true);
      return;
    }
    if (!validateForm()) return;
    setPlacing(true);
    try {
      const payload = {
        ...buildCheckoutPayload(cart, form, promo?.code),
        payment_method: method,
      };

      if (method === "cod") {
        const order = await orderService.createOrder(payload);
        await saveAddressToProfile(form);
        await refresh();
        clearCart();
        toast.success("Order placed successfully!");
        router.push(`/orders?order=${order.order_id}`);
      } else {
        await handleRazorpay();
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPlacing(false);
    }
  };

  if (cartLoading || authLoading) return <Loader fullScreen />;

  if (!cart.items.length) {
    return (
      <div className="container section" style={{ textAlign: "center" }}>
        <h2>Your cart is empty</h2>
        <p className="text-muted">Add items before checking out.</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="container section" style={{ textAlign: "center" }}>
          <h2>Sign in to checkout</h2>
          <p className="text-muted">
            Mobile OTP login is required to place an order.
          </p>
        </div>
        {loginOpen && (
          <LoginModal
            onClose={() => {
              setLoginOpen(false);
              router.push("/cart");
            }}
          />
        )}
      </>
    );
  }

  return (
    <div className="container section">
      <h1 className={styles.heading}>Checkout</h1>
      <p className={styles.subtitle}>
        Signed in as +91 {user?.phone}.
        {hasSavedAddress(user)
          ? " Your saved address is prefilled below."
          : " Complete your delivery details below."}
      </p>
      <div className={styles.layout}>
        <div className={styles.left}>
          <AddressForm
            address={form}
            onChange={setForm}
            phoneReadOnly
            onAddNewAddress={handleAddNewAddress}
          />
          <PaymentSection
            method={method}
            onChange={setMethod}
            onPlaceOrder={handlePlaceOrder}
            loading={placing}
          />
        </div>
        <OrderSummary
          promo={promo}
          onPromoChange={setPromo}
          pincode={form.pincode}
          state={form.state}
          paymentMethod={method}
        />
      </div>
    </div>
  );
}
