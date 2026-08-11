import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Contact form submitted:", formData);
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">

        {/* Left Side */}

        <div className="contact-content">

          <span className="contact-eyebrow">
            CONTACT US
          </span>

          <h2>
            Have questions?
            <br />
            Let's talk.
          </h2>

          <p>
            Whether you need help understanding HRMS, have questions
            about the platform, or want to discuss your requirements,
            our team is here to help.
          </p>

          <div className="contact-details">

            <div className="contact-detail">
              <div className="contact-detail-icon">
                <Mail size={19} />
              </div>

              <div>
                <span>Email</span>
                <strong>hrms@company.com</strong>
              </div>
            </div>

            <div className="contact-detail">
              <div className="contact-detail-icon">
                <Phone size={19} />
              </div>

              <div>
                <span>Phone</span>
                <strong>+91 00000 00000</strong>
              </div>
            </div>

            <div className="contact-detail">
              <div className="contact-detail-icon">
                <MapPin size={19} />
              </div>

              <div>
                <span>Location</span>
                <strong>India</strong>
              </div>
            </div>

          </div>

        </div>


        {/* Right Side */}

        <div className="contact-form-wrapper">

          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >

            <div className="contact-field">
              <label htmlFor="name">
                Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>


            <div className="contact-field">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>


            <div className="contact-field">
              <label htmlFor="message">
                Message
              </label>

              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Tell us how we can help..."
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>


            <button
              type="submit"
              className="contact-submit"
            >
              Send Message
              <Send size={17} />
            </button>

          </form>

        </div>

      </div>
    </section>
  );
}

export default Contact;