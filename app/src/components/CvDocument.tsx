import {
  Document,
  Page,
  View,
  Text,
  Link,
  StyleSheet,
  Font,
  renderToBuffer,
} from "@react-pdf/renderer";
import {
  profile,
  introWords,
  experience,
  projects,
  skills,
  education,
  languages,
  contacts,
  statsFor,
  type RepoStats,
} from "@/lib/cv";

// ─── Fonts ──────────────────────────────────────────────────────────────────
// IBM Plex Serif — a professional, fully Turkish-capable typeface. Served from
// /public/fonts; registered once per origin so @react-pdf can fetch it at render.

const registeredOrigins = new Set<string>();

export function registerCvFonts(origin: string) {
  if (registeredOrigins.has(origin)) return;

  Font.register({
    family: "IBMPlexSerif",
    fonts: [
      { src: `${origin}/fonts/IBMPlexSerif-Regular.ttf`, fontWeight: 400 },
      { src: `${origin}/fonts/IBMPlexSerif-SemiBold.ttf`, fontWeight: 600 },
      { src: `${origin}/fonts/IBMPlexSerif-Bold.ttf`, fontWeight: 700 },
      {
        src: `${origin}/fonts/IBMPlexSerif-Italic.ttf`,
        fontStyle: "italic",
        fontWeight: 400,
      },
    ],
  });

  // keep words intact — no automatic hyphenation breaks.
  Font.registerHyphenationCallback((word) => [word]);

  registeredOrigins.add(origin);
}

// ─── Palette ────────────────────────────────────────────────────────────────

const ink = "#1a1a1a";
const sub = "#3f3f3f";
const dim = "#6e6e6e";
const rule = "#d6d6d6";
const accent = "#373ce0";

// ─── Styles ─────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  page: {
    fontFamily: "IBMPlexSerif",
    fontSize: 9.5,
    lineHeight: 1.45,
    color: ink,
    paddingTop: 46,
    paddingBottom: 48,
    paddingHorizontal: 52,
  },

  // header
  name: {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: 0.2,
    // explicit so the big name doesn't inherit the page's small line box
    // (which would let the tagline overlap it).
    lineHeight: 1.2,
    marginBottom: 7,
  },
  tagline: { fontSize: 10, lineHeight: 1.3, color: sub, marginBottom: 7 },
  contactRow: { fontSize: 9, lineHeight: 1.5, color: dim },
  contactLink: { color: accent, textDecoration: "none" },
  contactSep: { color: dim },

  // summary
  summary: { fontSize: 10, lineHeight: 1.5, color: ink, marginTop: 12 },
  bold: { fontWeight: 700 },
  italic: { fontStyle: "italic", color: sub },
  summaryLink: { color: accent, fontWeight: 700, textDecoration: "none" },

  // sections
  section: { marginTop: 16 },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 600,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: ink,
    borderBottomWidth: 0.8,
    borderBottomColor: rule,
    paddingBottom: 4,
    marginBottom: 9,
  },
  sectionNote: {
    fontSize: 8.5,
    fontStyle: "italic",
    color: dim,
    marginTop: -5,
    marginBottom: 9,
  },

  // entries
  item: { marginBottom: 11 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  entryTitle: { fontSize: 10.5, fontWeight: 600, color: ink },
  entryTitleLink: {
    fontSize: 10.5,
    fontWeight: 600,
    color: ink,
    textDecoration: "none",
  },
  entryRole: { fontSize: 9.5, fontStyle: "italic", color: sub },
  meta: { fontSize: 9, color: dim },

  bulletRow: { flexDirection: "row", marginTop: 2.5 },
  bulletDot: { width: 10, color: dim },
  bulletText: { flex: 1, fontSize: 9.5, color: sub, lineHeight: 1.4 },

  // skills
  skillRow: { flexDirection: "row", marginBottom: 3.5 },
  skillTerm: { width: 96, fontWeight: 600, fontSize: 9.5, color: ink },
  skillDef: { flex: 1, fontSize: 9.5, color: sub },

  bodyText: { fontSize: 9.5, color: sub, marginTop: 2.5, lineHeight: 1.4 },
});

// ─── Document ─────────────────────────────────────────────────────────────────

interface CvProps {
  stats: Record<string, RepoStats> | null;
}

function Header() {
  return (
    <View>
      <Text style={s.name}>{profile.name}</Text>
      <Text style={s.tagline}>
        {profile.role}  ·  {profile.location}
      </Text>
      <Text style={s.contactRow}>
        {contacts.map((c, i) => (
          <Text key={c.href}>
            {i > 0 ? <Text style={s.contactSep}>{"   ·   "}</Text> : null}
            <Link src={c.href} style={s.contactLink}>
              {c.label}
            </Link>
          </Text>
        ))}
      </Text>
    </View>
  );
}

function Summary() {
  return (
    <Text style={s.summary}>
      {introWords.map((w, i) => {
        if (w.accent) {
          return (
            <Link key={i} src="https://sensity.ai" style={s.summaryLink}>
              {w.text}{" "}
            </Link>
          );
        }
        const style = w.bold ? s.bold : w.italic ? s.italic : undefined;
        return (
          <Text key={i} style={style}>
            {w.text}{" "}
          </Text>
        );
      })}
    </Text>
  );
}

function SectionTitle({ children }: { children: string }) {
  return <Text style={s.sectionTitle}>{children}</Text>;
}

export function CvDocument({ stats }: CvProps) {
  return (
    <Document
      title={`${profile.name} — cv`}
      author={profile.name}
      subject="curriculum vitae"
    >
      <Page size="A4" style={s.page}>
        <Header />
        <Summary />

        {/* experience */}
        <View style={s.section}>
          <SectionTitle>experience</SectionTitle>
          {experience.map((job) => (
            <View key={`${job.company}-${job.role}`} style={s.item} wrap={false}>
              <View style={s.rowBetween}>
                {job.companyHref ? (
                  <Link src={job.companyHref} style={s.entryTitleLink}>
                    {job.company}
                  </Link>
                ) : (
                  <Text style={s.entryTitle}>{job.company}</Text>
                )}
                <Text style={s.meta}>{job.period}</Text>
              </View>
              <View style={s.rowBetween}>
                <Text style={s.entryRole}>{job.role}</Text>
                <Text style={s.meta}>{job.location}</Text>
              </View>
              {job.bullets.map((b) => (
                <View key={b} style={s.bulletRow}>
                  <Text style={s.bulletDot}>•</Text>
                  <Text style={s.bulletText}>{b}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* selected projects */}
        <View style={s.section}>
          <SectionTitle>selected projects</SectionTitle>
          <Text style={s.sectionNote}>
            a handful from 105+ things i&apos;ve built since i was 13
          </Text>
          {projects.map((project) => {
            const stat = statsFor(project, stats);
            return (
              <View key={project.name} style={s.item} wrap={false}>
                <View style={s.rowBetween}>
                  {project.href ? (
                    <Link src={project.href} style={s.entryTitleLink}>
                      {project.name}
                    </Link>
                  ) : (
                    <Text style={s.entryTitle}>{project.name}</Text>
                  )}
                  {stat ? <Text style={s.meta}>{stat}</Text> : null}
                </View>
                <Text style={s.entryRole}>{project.subtitle}</Text>
                <Text style={s.bodyText}>{project.description}</Text>
              </View>
            );
          })}
        </View>

        {/* skills */}
        <View style={s.section}>
          <SectionTitle>skills</SectionTitle>
          {skills.map((sk) => (
            <View key={sk.term} style={s.skillRow}>
              <Text style={s.skillTerm}>{sk.term}</Text>
              <Text style={s.skillDef}>{sk.def}</Text>
            </View>
          ))}
        </View>

        {/* education */}
        <View style={s.section}>
          <SectionTitle>education</SectionTitle>
          <View style={s.rowBetween} wrap={false}>
            <View>
              <Text style={s.entryTitle}>{education.school}</Text>
              <Text style={s.entryRole}>{education.degree}</Text>
            </View>
            <Text style={s.meta}>{education.period}</Text>
          </View>
        </View>

        {/* languages */}
        <View style={s.section}>
          <SectionTitle>languages</SectionTitle>
          <Text style={s.bodyText}>
            {languages.map((l, i) => (
              <Text key={l.name}>
                {i > 0 ? "   ·   " : ""}
                {l.name} <Text style={{ color: dim }}>({l.level})</Text>
              </Text>
            ))}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

// rendered to a buffer by the route handler (keeps JSX out of route.ts).
export function renderCvPdf(
  stats: Record<string, RepoStats> | null,
): Promise<Buffer> {
  return renderToBuffer(<CvDocument stats={stats} />);
}
