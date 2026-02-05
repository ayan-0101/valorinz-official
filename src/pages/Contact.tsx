import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Clock, Send, Instagram, Twitter, Youtube } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_u604rvn";
const EMAILJS_TEMPLATE_ID = "template_hkmbf1l";
const EMAILJS_PUBLIC_KEY = "yIjYbCC8V7Z0mbkLt";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: "VALORINz official",
          subject: formData.subject,
          from_email: formData.email,
          message: `The user ${formData.name} has query:\n\n${formData.message}\n\nConnect with them soon.`,
        },
        EMAILJS_PUBLIC_KEY
      );

      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Header />
      <main className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="font-display text-4xl lg:text-5xl font-bold mb-4">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Have a question or want to collaborate? We'd love to hear from you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Your name"
                      required
                      className="bg-muted border-border focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="your@email.com"
                      required
                      className="bg-muted border-border focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <Input
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    placeholder="How can we help?"
                    required
                    className="bg-muted border-border focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Tell us more..."
                    rows={6}
                    required
                    className="bg-muted border-border focus:border-primary resize-none"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-neon w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send size={18} />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              <div className="card-glow p-6 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold mb-1">Email Us</h3>
                    <p className="text-muted-foreground">support@valorin.com</p>
                    <p className="text-muted-foreground">press@valorin.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold mb-1">Location</h3>
                    <p className="text-muted-foreground">
                      Los Angeles, California
                      <br />
                      United States
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold mb-1">Support Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Friday: 9AM - 6PM PST
                      <br />
                      Weekend: Email only
                    </p>
                  </div>
                </div>
              </div>

              <div className="card-glow p-6">
                <h3 className="font-display font-semibold mb-4">Follow Us</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Stay updated with our latest drops and behind-the-scenes content.
                </p>
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="p-3 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-all"
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href="#"
                    className="p-3 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-all"
                  >
                    <Twitter size={20} />
                  </a>
                  <a
                    href="#"
                    className="p-3 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-all"
                  >
                    <Youtube size={20} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
