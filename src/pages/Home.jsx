import * as Dialog from '@radix-ui/react-dialog'
import { motion as Motion } from 'framer-motion'
import { Github, Linkedin, Mail, Moon, Sun, X } from 'lucide-react'
import { Link, useOutletContext } from 'react-router-dom'
import profileData from '../data/profile'
import { education, experience, skillCategories } from '../data/experience'
import Timeline from '../components/Timeline'
import SEO from '../components/SEO'
import site from '../data/site'
import useViewportSpace from '../hooks/useViewportSpace'

function BrandXIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26L23 21.75h-6.728l-5.267-6.812-5.964 6.812H1.73l7.73-8.835L1 2.25h6.898l4.76 6.231 5.586-6.231Zm-1.161 17.52h1.833L6.902 4.126H4.936L17.083 19.77Z" />
    </svg>
  )
}

function InfoDialog({ label, title, triggerClassName, children }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Motion.button whileHover={{ scale: 1.02 }} className={triggerClassName}>
          {label}
        </Motion.button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[120] bg-black/50" />
        <Dialog.Content className="fixed z-[121] left-1/2 top-1/2 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 outline-none">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
            <Dialog.Close
              className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>
          <div className="mt-4">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function SkillsDialogContent({ isDark }) {
  const categoryClass = isDark
    ? 'text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9eb2be]'
    : 'text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5f7882]'

  const chipClass = isDark
    ? 'inline-flex items-center gap-2 rounded-md border border-[#2e3d47] bg-[#17242d] px-2.5 py-1.5 text-xs text-[#cfdbe3]'
    : 'inline-flex items-center gap-2 rounded-md border border-[#d7e1e6] bg-[#f6f9fb] px-2.5 py-1.5 text-xs text-[#324953]'

  const logoClass = isDark
    ? 'h-3.5 w-3.5 opacity-90 grayscale invert'
    : 'h-3.5 w-3.5 opacity-80 grayscale'

  return (
    <div className="space-y-4">
      {skillCategories.map((group) => (
        <section key={group.category}>
          <h3 className={categoryClass}>{group.category}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {group.skills.map((skill) => (
              <span key={skill.name} className={chipClass}>
                <img
                  src={skill.logo}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  className={logoClass}
                />
                <span>{skill.name}</span>
              </span>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default function Home() {
  const space = useViewportSpace()
  const outletContext = useOutletContext() || {}
  const isDark = outletContext.isDark || false
  const onToggleTheme = outletContext.onToggleTheme || (() => {})

  const lightPrimaryButton =
    'px-4 py-2 rounded-full border border-[#4f7a82]/35 bg-[#6f9ca2] text-white hover:bg-[#5f8c93] transition-colors'
  const lightSecondaryButton =
    'px-4 py-2 rounded-full border border-[#d7d9d6] bg-[#f1f2ee] text-[#314148] hover:bg-[#e9ece7] transition-colors'
  const homeUrl = `${site.baseUrl}/`
  const homeKeywords = [
    'Yassine Hadry',
    'DevOps Engineer',
    'Software Engineer',
    'Kubernetes',
    'CI/CD',
    'Cloud',
    'OCI',
  ]
  const homeJsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: profileData.name,
      jobTitle: profileData.headline,
      url: homeUrl,
      image: `${site.baseUrl}${profileData.photo}`,
      sameAs: [profileData.social.github, profileData.social.linkedin, profileData.social.x],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: site.name,
      url: homeUrl,
      inLanguage: 'en',
    },
  ]

  if (isDark) {
    return (
      <>
        <SEO
          title=""
          description={site.description}
          url={homeUrl}
          keywords={homeKeywords}
          jsonLd={homeJsonLd}
        />

        <section
          style={space ? { minHeight: `${space}px` } : undefined}
          className="relative flex items-center justify-center"
        >
          <Motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="home-float-card-dark relative mx-auto w-full max-w-5xl rounded-[30px] p-4 sm:p-8 md:p-10"
          >
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/" aria-label="Home" className="inline-flex h-10 px-1 items-center justify-center">
                <img
                  src="/logo-yh-white.png"
                  alt="Yassine Hadry"
                  width={36}
                  height={31}
                  loading="eager"
                  decoding="async"
                  className="h-6 sm:h-7 w-auto object-contain"
                />
              </Link>

              <nav className="ml-auto flex flex-wrap items-center justify-end gap-3 text-[13px] sm:text-sm">
                <Link to="/resources" className="text-[#b8c6d1] hover:text-[#e6eef5]">
                  Resources
                </Link>
                <button
                  onClick={onToggleTheme}
                  className="h-8 w-8 text-[#b7c8d4] hover:text-[#f6fafd] flex items-center justify-center"
                  aria-label="Switch to light mode"
                  title="Light mode"
                >
                  <Sun className="h-4 w-4" />
                </button>
              </nav>
            </div>

            <div className="mt-8 sm:mt-10 flex flex-col items-center text-center">
              <img
                src={profileData.photo}
                alt={profileData.name}
                width={152}
                height={152}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="h-32 w-32 sm:h-36 sm:w-36 rounded-full object-cover border-4 border-[#202b33] shadow-[0_10px_32px_rgba(0,0,0,0.42)]"
              />

              <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-[#eef4f8]">
                {profileData.name}
              </h1>
              <p className="mt-1 text-base sm:text-lg text-[#a9bac5]">{profileData.headline}</p>

              <p className="mt-4 mx-auto max-w-2xl leading-relaxed text-[#9fb0bc]">
                {profileData.blurb}
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a
                  href={profileData.calendlyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-full border border-[#5f8190]/40 bg-[#446b77] text-[#ecf4f7] hover:bg-[#507d8b] transition-colors"
                >
                  Let&apos;s Talk
                </a>

                <Link
                  to="/blog"
                  className="px-4 py-2 rounded-full border border-[#2f3b44] bg-[#1b242b] text-[#cad6de] hover:bg-[#232f38] transition-colors"
                >
                  Blog
                </Link>

                <Link
                  to="/projects"
                  className="px-4 py-2 rounded-full border border-[#2f3b44] bg-[#1b242b] text-[#cad6de] hover:bg-[#232f38] transition-colors"
                >
                  Projects
                </Link>

                <InfoDialog
                  label="My Career"
                  title="Career"
                  triggerClassName="px-4 py-2 rounded-full border border-[#2f3b44] bg-[#1b242b] text-[#cad6de] hover:bg-[#232f38] transition-colors"
                >
                  <Timeline items={experience} />
                </InfoDialog>

                <InfoDialog
                  label="My Education"
                  title="Education"
                  triggerClassName="px-4 py-2 rounded-full border border-[#2f3b44] bg-[#1b242b] text-[#cad6de] hover:bg-[#232f38] transition-colors"
                >
                  <Timeline items={education} />
                </InfoDialog>

                <InfoDialog
                  label="My Skills"
                  title="Skills"
                  triggerClassName="px-4 py-2 rounded-full border border-[#2f3b44] bg-[#1b242b] text-[#cad6de] hover:bg-[#232f38] transition-colors"
                >
                  <SkillsDialogContent isDark={isDark} />
                </InfoDialog>
              </div>

              <div className="mt-6 flex items-center justify-center gap-4 text-[#9fb0bc]">
                <a
                  href={profileData.social.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  title="GitHub"
                  className="h-9 w-9 hover:text-[#eff6fb] flex items-center justify-center"
                >
                  <Github className="w-4 h-4" />
                  <span className="sr-only">GitHub</span>
                </a>
                <a
                  href={profileData.social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                  className="h-9 w-9 hover:text-[#eff6fb] flex items-center justify-center"
                >
                  <Linkedin className="w-4 h-4" />
                  <span className="sr-only">LinkedIn</span>
                </a>
                <a
                  href={profileData.social.x}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X"
                  title="X"
                  className="h-9 w-9 hover:text-[#eff6fb] flex items-center justify-center"
                >
                  <BrandXIcon className="w-4 h-4" />
                  <span className="sr-only">X</span>
                </a>
                <a
                  href={profileData.social.email}
                  aria-label="Email"
                  title="Email"
                  className="h-9 w-9 hover:text-[#eff6fb] flex items-center justify-center"
                >
                  <Mail className="w-4 h-4" />
                  <span className="sr-only">Email</span>
                </a>
              </div>
            </div>
          </Motion.div>
        </section>
      </>
    )
  }

  return (
    <>
      <SEO
        title=""
        description={site.description}
        url={homeUrl}
        keywords={homeKeywords}
        jsonLd={homeJsonLd}
      />

      <section
        style={space ? { minHeight: `${space}px` } : undefined}
        className="relative flex items-center justify-center"
      >
        <Motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="home-float-card relative mx-auto w-full max-w-5xl rounded-[30px] p-4 sm:p-8 md:p-10"
        >
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/"
              aria-label="Home"
              className="inline-flex h-10 px-1 items-center justify-center"
            >
              <img
                src="/logo-yh.png"
                alt="Yassine Hadry"
                width={36}
                height={31}
                loading="eager"
                decoding="async"
                className="h-6 sm:h-7 w-auto object-contain"
              />
            </Link>

            <nav className="ml-auto flex flex-wrap items-center justify-end gap-3 text-[13px] sm:text-sm">
              <Link
                to="/resources"
                className="text-[#2f4952] hover:text-[#1f3b45]"
              >
                Resources
              </Link>
              <button
                onClick={onToggleTheme}
                className="h-8 w-8 text-[#355766] hover:text-[#1f3b45] flex items-center justify-center"
                aria-label="Switch to dark mode"
                title="Dark mode"
              >
                <Moon className="h-4 w-4" />
              </button>
            </nav>
          </div>

          <div className="mt-8 sm:mt-10 flex flex-col items-center text-center">
            <img
              src={profileData.photo}
              alt={profileData.name}
              width={152}
              height={152}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="h-32 w-32 sm:h-36 sm:w-36 rounded-full object-cover border-4 border-[#f4f6f3] shadow-[0_8px_28px_rgba(36,58,67,0.16)]"
            />

            <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-[#1f2f35]">
              {profileData.name}
            </h1>
            <p className="mt-1 text-base sm:text-lg text-[#496169]">{profileData.headline}</p>

            <p className="mt-4 mx-auto max-w-2xl leading-relaxed text-[#4b5e66]">{profileData.blurb}</p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href={profileData.calendlyUrl}
                target="_blank"
                rel="noreferrer"
                className={lightPrimaryButton}
              >
                Let&apos;s Talk
              </a>

              <Link to="/blog" className={lightSecondaryButton}>
                Blog
              </Link>

              <Link to="/projects" className={lightSecondaryButton}>
                Projects
              </Link>

              <InfoDialog
                label="My Career"
                title="Career"
                triggerClassName={lightSecondaryButton}
              >
                <Timeline items={experience} />
              </InfoDialog>

              <InfoDialog
                label="My Education"
                title="Education"
                triggerClassName={lightSecondaryButton}
              >
                <Timeline items={education} />
              </InfoDialog>

              <InfoDialog label="My Skills" title="Skills" triggerClassName={lightSecondaryButton}>
                <SkillsDialogContent isDark={isDark} />
              </InfoDialog>
            </div>

            <div className="mt-6 flex items-center justify-center gap-4 text-[#546a72]">
              <a
                href={profileData.social.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                title="GitHub"
                className="h-9 w-9 hover:text-[#314d59] flex items-center justify-center"
              >
                <Github className="w-4 h-4" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href={profileData.social.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="h-9 w-9 hover:text-[#314d59] flex items-center justify-center"
              >
                <Linkedin className="w-4 h-4" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href={profileData.social.x}
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                title="X"
                className="h-9 w-9 hover:text-[#314d59] flex items-center justify-center"
              >
                <BrandXIcon className="w-4 h-4" />
                <span className="sr-only">X</span>
              </a>
              <a
                href={profileData.social.email}
                aria-label="Email"
                title="Email"
                className="h-9 w-9 hover:text-[#314d59] flex items-center justify-center"
              >
                <Mail className="w-4 h-4" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
        </Motion.div>
      </section>
    </>
  )
}
