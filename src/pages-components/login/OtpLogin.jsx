"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import Button from "@/components/Button/Button";
import Logo from "@/components/Logo/Logo";
import { useAuth } from "@/hooks/useAuth";
import { useOtp } from "@/hooks/useOtp";
import { isValidOtp, isValidPhone, normalizePhone } from "@/utils/validators";
import styles from "./OtpLogin.module.css";

export default function OtpLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { sendOtp, verifyOtp } = useAuth();
  const { secondsLeft, canResend, startTimer } = useOtp(30);

  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    if (!isValidPhone(phone)) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }
    setLoading(true);
    try {
      const res = await sendOtp(normalizePhone(phone));
      toast.success("OTP sent successfully");
      if (res?.debug_otp) {
        toast(`Dev OTP: ${res.debug_otp}`, { duration: 8000, icon: "🔑" });
      }
      setStep("otp");
      startTimer();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!isValidOtp(otp)) {
      toast.error("Enter the 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(normalizePhone(phone), otp);
      toast.success("Logged in successfully");
      router.push(redirect);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <Logo size={52} className={styles.logo} />
        <h1>{step === "phone" ? "Login / Sign up" : "Verify OTP"}</h1>
        <p>
          {step === "phone"
            ? "Enter your phone number to receive a one-time password"
            : `We sent a code to ${normalizePhone(phone)}`}
        </p>
      </div>

      {step === "phone" ? (
        <form onSubmit={handleSendOtp} className={styles.form}>
          <label>Phone Number</label>
          <input
            type="tel"
            placeholder="98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoFocus
          />
          <Button type="submit" fullWidth size="lg" loading={loading}>
            Send OTP
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className={styles.form}>
          <label>Enter OTP</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="------"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className={styles.otpInput}
            autoFocus
          />
          <Button type="submit" fullWidth size="lg" loading={loading}>
            Verify & Continue
          </Button>

          <div className={styles.resend}>
            {canResend ? (
              <button type="button" onClick={handleSendOtp}>
                Resend OTP
              </button>
            ) : (
              <span>Resend in {secondsLeft}s</span>
            )}
            <button type="button" onClick={() => setStep("phone")}>
              Change number
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
