import type { Metadata } from "next";
import { site } from "@/site.config";
import { EmailReveal } from "@/components/EmailReveal";
import { PageHead } from "@/components/PageHead";
import { Rule } from "@/components/Rule";

export const metadata: Metadata = {
  title: "Contact",
  description: "How to write to Shreyan Chethan, and what this site does and does not collect.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <>
      <PageHead
        slug="contact"
        title="Correspondence"
        standfirst="If you want to talk about anything on here, email me."
      />

      <div className="sheet mt-14 lg:mt-20">
        <div className="sheet-row">
          <p className="col-rail label pt-3">Write to</p>
          <div className="col-text">
            <EmailReveal user={site.email.user} domain={site.email.domain} />
            <noscript>
              <p className="mt-4 text-note text-ink-2">
                The address is {site.email.user} at {site.email.domain}.
              </p>
            </noscript>
          </div>
        </div>
      </div>

      <div className="sheet mt-16 lg:mt-20">
        <div className="sheet-row">
          <p className="col-rail label pt-1">Elsewhere</p>
          <ul className="col-text flex flex-wrap gap-x-8 gap-y-2 text-[1.25rem]">
            {site.profiles.map((p) => (
              <li key={p.label}>
                <a href={p.href} rel="me noopener noreferrer">
                  {p.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section aria-labelledby="privacy" className="sheet mt-24 lg:mt-32">
        <Rule heavy />
        <div className="sheet-row pt-5">
          <h2 id="privacy" className="col-rail label">
            Privacy
          </h2>
          <div className="col-text prose-sheet text-[1.0625rem]">
            <p>No cookies, no analytics, no trackers, no forms.</p>
          </div>
        </div>
      </section>
    </>
  );
}
