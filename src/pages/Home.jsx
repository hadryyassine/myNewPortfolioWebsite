import { useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { motion as Motion } from 'framer-motion'
import { Github, Linkedin, Mail, Moon, Sun, X } from 'lucide-react'
import { Link, useOutletContext } from 'react-router-dom'
import profileData from '../data/profile'
import { education, experience, skillCategories } from '../data/experience'
import SkillCategoriesPanel from '../components/SkillCategoriesPanel'
import Timeline from '../components/Timeline'
import SEO from '../components/SEO'
import site from '../data/site'
import useViewportSpace from '../hooks/useViewportSpace'
import { preloadImage, runWhenIdle } from '../utils/performance'

const homeTheme = {
  light: {
    card: 'home-float-card',
    logo: '/logo-yh.png',
    navLink: 'text-[#2f4952] hover:text-[#1f3b45]',
    themeBtn: 'h-8 w-8 text-[#355766] hover:text-[#1f3b45] flex items-center justify-center',
    themeBtnLabel: 'Switch to dark mode',
    themeBtnTitle: 'Dark mode',
    ThemeIcon: Moon,
    avatarBorder: 'border-[#f4f6f3] shadow-[0_8px_28px_rgba(36,58,67,0.16)]',
    heading: 'text-[#1f2f35]',
    subheading: 'text-[#496169]',
    blurb: 'text-[#4b5e66]',
    primaryBtn:
      'px-4 py-2 rounded-full border border-[#4f7a82]/35 bg-[#6f9ca2] text-white hover:bg-[#5f8c93] transition-colors',
    secondaryBtn:
      'px-4 py-2 rounded-full border border-[#d7d9d6] bg-[#f1f2ee] text-[#314148] hover:bg-[#e9ece7] transition-colors',
    socialGroup: 'text-[#546a72]',
    socialHover: 'h-9 w-9 hover:text-[#314d59] flex items-center justify-center',
  },
  dark: {
    card: 'home-float-card-dark',
    logo: '/logo-yh-white.png',
    navLink: 'text-[#b8c6d1] hover:text-[#e6eef5]',
    themeBtn: 'h-8 w-8 text-[#b7c8d4] hover:text-[#f6fafd] flex items-center justify-center',
    themeBtnLabel: 'Switch to light mode',
    themeBtnTitle: 'Light mode',
    ThemeIcon: Sun,
    avatarBorder: 'border-[#202b33] shadow-[0_10px_32px_rgba(0,0,0,0.42)]',
    heading: 'text-[#eef4f8]',
    subheading: 'text-[#a9bac5]',
    blurb: 'text-[#9fb0bc]',
    primaryBtn:
      'px-4 py-2 rounded-full border border-[#5f8190]/40 bg-[#446b77] text-[#ecf4f7] hover:bg-[#507d8b] transition-colors',
    secondaryBtn:
      'px-4 py-2 rounded-full border border-[#2f3b44] bg-[#1b242b] text-[#cad6de] hover:bg-[#232f38] transition-colors',
    socialGroup: 'text-[#9fb0bc]',
    socialHover: 'h-9 w-9 hover:text-[#eff6fb] flex items-center justify-center',
  },
}

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
        <Motion.button
          whileHover={{ y: -1 }}
          transition={{ type: 'spring', stiffness: 360, damping: 26, mass: 0.45 }}
          className={triggerClassName}
        >
          {label}
        </Motion.button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[120] bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[121] flex w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-[var(--color-border-secondary)] bg-white outline-none dark:bg-neutral-950">
          <div className="flex items-center justify-between border-b-[0.5px] border-b-[var(--color-border-tertiary)] px-7 pt-6 pb-5">
            <Dialog.Title className="text-[17px] font-medium text-[var(--color-text-primary)]">
              {title}
            </Dialog.Title>
            <Dialog.Close
              className="rounded-md p-1 text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-text-primary)]"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>
          <div className="max-h-[min(70vh,calc(100vh-160px))] overflow-y-auto px-7 pt-7 pb-8">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default function Home() {
  const space = useViewportSpace()
  const outletContext = useOutletContext() || {}
  const isDark = outletContext.isDark || false
  const onToggleTheme = outletContext.onToggleTheme || (() => {})

  useEffect(() => {
    const skillLogos = skillCategories.flatMap((group) => group.skills.map((skill) => skill.logo))
    const cancelIdleWarmup = runWhenIdle(() => {
      skillLogos.forEach(preloadImage)
    })

    return cancelIdleWarmup
  }, [])

  const t = isDark ? homeTheme.dark : homeTheme.light
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
        <div className={`${t.card} relative mx-auto w-full max-w-5xl rounded-[30px] p-4 sm:p-8 md:p-10`}>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/" aria-label="Home" className="inline-flex h-10 px-1 items-center justify-center">
              <img
                src={t.logo}
                alt="Yassine Hadry"
                width={36}
                height={31}
                loading="eager"
                decoding="async"
                className="h-6 sm:h-7 w-auto object-contain"
              />
            </Link>

            <nav className="ml-auto flex flex-wrap items-center justify-end gap-3 text-[13px] sm:text-sm">
              <Link to="/resources" className={t.navLink}>
                Resources
              </Link>
              <button
                onClick={onToggleTheme}
                className={t.themeBtn}
                aria-label={t.themeBtnLabel}
                title={t.themeBtnTitle}
              >
                <t.ThemeIcon className="h-4 w-4" />
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
              className={`h-32 w-32 sm:h-36 sm:w-36 rounded-full object-cover border-4 ${t.avatarBorder}`}
            />

            <h1 className={`mt-4 text-3xl sm:text-4xl font-semibold tracking-tight ${t.heading}`}>
              {profileData.name}
            </h1>
            <p className={`mt-1 text-base sm:text-lg ${t.subheading}`}>{profileData.headline}</p>

            <p className={`mt-4 mx-auto max-w-2xl leading-relaxed ${t.blurb}`}>
              {profileData.blurb}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href={profileData.calendlyUrl}
                target="_blank"
                rel="noreferrer"
                className={t.primaryBtn}
              >
                Let&apos;s Talk
              </a>

              <Link to="/blog" className={t.secondaryBtn}>
                Blog
              </Link>

              <Link to="/projects" className={t.secondaryBtn}>
                Projects
              </Link>

              <InfoDialog label="My Career" title="Career" triggerClassName={t.secondaryBtn}>
                <Timeline items={experience} />
              </InfoDialog>

              <InfoDialog label="My Education" title="Education" triggerClassName={t.secondaryBtn}>
                <Timeline items={education} />
              </InfoDialog>

              <InfoDialog label="My Skills" title="Skills" triggerClassName={t.secondaryBtn}>
                <SkillCategoriesPanel isDark={isDark} />
              </InfoDialog>
            </div>

            <div className={`mt-6 flex items-center justify-center gap-4 ${t.socialGroup}`}>
              <a
                href={profileData.social.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                title="GitHub"
                className={t.socialHover}
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
                className={t.socialHover}
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
                className={t.socialHover}
              >
                <BrandXIcon className="w-4 h-4" />
                <span className="sr-only">X</span>
              </a>
              <a
                href={profileData.social.email}
                aria-label="Email"
                title="Email"
                className={t.socialHover}
              >
                <Mail className="w-4 h-4" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
