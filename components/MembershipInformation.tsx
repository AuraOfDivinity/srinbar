"use client";

import { useId, useState } from "react";
import type { ContactPageDoc } from "@/sanity/types";

const languageNames: Record<string, string> = {
  en: "English",
  si: "සිංහල",
  ta: "தமிழ்",
};

export default function MembershipInformation({ information = [] }: { information: ContactPageDoc["membershipInformation"] }) {
  const [language, setLanguage] = useState("en");
  const id = useId();
  const selected = information.find((item) => item.language === language) ?? information[0];
  if (!selected) return null;

  return (
    <section className="contact-membership-info" aria-labelledby={`${id}-heading`}>
      <header>
        <h2 id={`${id}-heading`} lang={selected.language}>{selected.title.split(" · ")[0]}</h2>
        <label className="membership-language">
          <span>Language</span>
          <select value={selected.language} onChange={(event) => setLanguage(event.target.value)} aria-controls={`${id}-content`}>
            {information.map((item) => (
              <option key={item.language} value={item.language} lang={item.language}>
                {languageNames[item.language] ?? item.language}
              </option>
            ))}
          </select>
        </label>
      </header>
      <div id={`${id}-content`} lang={selected.language}>
        {selected.body.split(/\n\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>
    </section>
  );
}
