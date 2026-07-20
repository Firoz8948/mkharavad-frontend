"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import Button from "@/components/Button/Button";
import api from "@/services/api";
import { isValidEmail, required } from "@/utils/validators";
import styles from "./ContactForm.module.css";

const initial = { name: "", email: "", phone: "", subject: "", message: "" };

export default function ContactForm() {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!required(form.name) || !required(form.message)) {
      toast.error("Please fill in your name and message");
      return;
    }
    if (!isValidEmail(form.email)) {
      toast.error("Please enter a valid email");
      return;
    }
    setLoading(true);
    try {
      await api.post("/contact/submit", form);
      toast.success("Message sent! We'll get back to you soon.");
      setForm(initial);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Send us a message</h2>
      <div className={styles.row}>
        <input name="name" placeholder="Your Name *" value={form.name} onChange={handleChange} />
        <input name="email" type="email" placeholder="Email *" value={form.email} onChange={handleChange} />
      </div>
      <div className={styles.row}>
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <input name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} />
      </div>
      <textarea
        name="message"
        rows={5}
        placeholder="Your Message *"
        value={form.message}
        onChange={handleChange}
      />
      <Button type="submit" size="lg" loading={loading}>
        Send Message
      </Button>
    </form>
  );
}
