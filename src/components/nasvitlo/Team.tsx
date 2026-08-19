import Image from "next/image";
import { type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { pick, type TeamMember } from "@/content/types";

/**
 * The people behind the library. Without portraits it reads as a masthead
 * (name over role); as soon as `photo` is filled in for the members the same
 * grid becomes a portrait row — see `TeamMember.photo`.
 */
export default function Team({
  locale,
  dict,
  team,
}: {
  locale: Locale;
  dict: Dictionary;
  team: TeamMember[];
}) {
  if (team.length === 0) return null;

  const withPhotos = team.some((m) => m.photo);

  return (
    <div
      id="team"
      style={{
        position: "relative",
        zIndex: 3,
        padding: "44px 28px 46px",
        background: "var(--surface)",
        borderTop: "1px solid var(--rule)",
        scrollMarginTop: 16,
      }}
    >
      <div className="nsv-sechead" style={{ marginBottom: 22 }}>
        <div>
          <div className="lbl">
            <span>{dict.team.label}</span>
          </div>
          <h2
            style={{
              fontFamily: "var(--brand-font-display),serif",
              fontWeight: 400,
              fontSize: 26,
              color: "var(--ink)",
              margin: 0,
            }}
          >
            {dict.team.heading}
          </h2>
        </div>
      </div>

      <ul className="nsv-team" data-portraits={withPhotos ? "yes" : "no"}>
        {team.map((member) => {
          const name = pick(member.name, locale);
          return (
            <li key={member.id}>
              {member.photo ? (
                <Image
                  className="tphoto"
                  src={member.photo}
                  alt={name}
                  width={300}
                  height={360}
                />
              ) : null}
              <span className="tname">{name}</span>
              <span className="trole">{pick(member.role, locale)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
