"use client";
import React from "react";

import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { useContact } from "~/modules/contact/hook/useContact";
import { contactMessages } from "~/modules/landing/data/contact";
import { error } from "console";
export function ContactSection() {

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [alreadyExists, setAlreadyExists] = useState(false);
  // const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const { submit, isLoading } = useContact({
    onSuccess: () => {
      setSubmitted(true);
      setFormData({ firstName: "", lastName: "", phone: "", email: "" });
      console.log("Form submitted successfully");
    },
    onDuplicate: () => {
      console.log("Duplicated");
      setAlreadyExists(true);
    },
    onError: (message) => {
      setErrors({ general: message });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Simple validation example
    const newErrors: Record<string, string> = {};

    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.email) newErrors.email = "Email is required";

    if (Object.keys(newErrors).length > 0) {
      console.log("Validation errors:", Object.keys(newErrors));
      setErrors(newErrors);
      return;
    }

    setErrors({}); // Clear errors if validation passes
    console.log("Submitting:", formData);
    submit(formData);
  };

  const showMessage = submitted || alreadyExists;

  const title = alreadyExists
    ? contactMessages.duplicateTitle
    : contactMessages.successTitle;

  const body = alreadyExists
    ? contactMessages.duplicateBody
    : contactMessages.successBody;

  const reset = () => {
    setAlreadyExists(false);
    setSubmitted(false);
    setErrors({});
  };

  return (
    <section
      id="contact"
      className="bg-muted/50 border-border w-full border-t py-20"
    >
      <div className="container mx-auto max-w-2xl px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold">Let’s Connect</h2>
        <p className="text-muted-foreground mb-10">
          Leave your details and we’ll get in touch with you shortly.
        </p>

        {showMessage ? (
          <div className="space-y-4 py-10 text-center">
            <h3 className="text-2xl font-semibold">{title}</h3>
            <p className="text-muted-foreground">{body}</p>
            <Button variant="ghost" onClick={reset}>
              {contactMessages.resetLabel}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </Button>

             {errors.general && <p className="text-sm text-red-500 mt-2">{errors.general}</p>}
          </form>
        )}
      </div>
    </section>
  );
}
