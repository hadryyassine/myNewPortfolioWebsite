import * as Dialog from '@radix-ui/react-dialog'
import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import profileData from '../data/profile'
import { experience, education, skills } from '../data/experience'
import Timeline from '../components/Timeline'
import SEO from '../components/SEO'
import site from '../data/site'
import useViewportSpace from '../hooks/useViewportSpace'

export default function Home() {
  const space = useViewportSpace()

  return (
    <>
      <SEO title="" description={site.description} url={`${site.baseUrl}/`} />

      {/* Take the remaining viewport height; center the card */}
      <section
        style={space ? { minHeight: `${space}px` } : undefined}
        className="flex items-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="
            mx-auto w-full max-w-4xl
            rounded-2xl border border-neutral-200 dark:border-neutral-800
            p-12 sm:p-14 md:p-16
            text-center
          "
        >
          {/* Stack with generous vertical rhythm (more air on mobile) */}
          <div className="flex flex-col items-center text-center space-y-7 sm:space-y-6 md:space-y-7">
            {/* Photo */}
            <img
              src={profileData.photo}
              alt={profileData.name}
              width={144}
              height={144}
              loading="eager"
              fetchpriority="high"
              decoding="async"
              className="h-32 w-32 sm:h-36 sm:w-36 rounded-full object-cover border border-neutral-200 dark:border-neutral-800"
            />

            {/* Name + headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                {profileData.name}
              </h1>
              <p className="text-base sm:text-lg text-neutral-700 dark:text-neutral-300">
                {profileData.headline}
              </p>
            </div>

            {/* Blurb */}
            <p className="mx-auto max-w-2xl leading-relaxed text-neutral-600 dark:text-neutral-400">
              {profileData.blurb}
            </p>

            {/* Primary actions (added Blog button) */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-5">
              <a
                href={profileData.cvUrl}
                className="px-3.5 py-2 rounded-lg bg-brand/10 border border-brand/30 hover:bg-brand/20"
              >
                Download CV
              </a>

              <Link
                to="/blog"
                className="px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900"
              >
                Blog
              </Link>

              {/* Career */}
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                  >
                    My Career
                  </motion.button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                  <Dialog.Content className="fixed left-1/2 top-1/2 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 outline-none">
                    <div className="flex items-center justify-between">
                      <Dialog.Title className="text-lg font-semibold">Career</Dialog.Title>
                      <Dialog.Close className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900" aria-label="Close">
                        <X className="w-5 h-5" />
                      </Dialog.Close>
                    </div>
                    <div className="mt-4">
                      <Timeline items={experience} />
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>

              {/* Education */}
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                  >
                    My Education
                  </motion.button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                  <Dialog.Content className="fixed left-1/2 top-1/2 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 outline-none">
                    <div className="flex items-center justify-between">
                      <Dialog.Title className="text-lg font-semibold">Education</Dialog.Title>
                      <Dialog.Close className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900" aria-label="Close">
                        <X className="w-5 h-5" />
                      </Dialog.Close>
                    </div>
                    <div className="mt-4">
                      <Timeline items={education} />
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>

              {/* Skills */}
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                  >
                    My Skills
                  </motion.button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                  <Dialog.Content className="fixed left-1/2 top-1/2 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 outline-none">
                    <div className="flex items-center justify-between">
                      <Dialog.Title className="text-lg font-semibold">Skills</Dialog.Title>
                      <Dialog.Close className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900" aria-label="Close">
                        <X className="w-5 h-5" />
                      </Dialog.Close>
                    </div>
                    <div className="mt-4">
                      <div className="flex flex-wrap justify-center gap-2">
                        {skills.map((s) => (
                          <span
                            key={s}
                            className="text-xs px-2 py-1 rounded-md border border-neutral-200 dark:border-neutral-800"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </div>

            {/* Icons-only socials (accessible) */}
            <div className="pt-1 flex items-center justify-center gap-6 text-neutral-600 dark:text-neutral-400">
              <a href={profileData.social.github} target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub" className="hover:text-neutral-800 dark:hover:text-neutral-200">
                <Github className="w-5 h-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href={profileData.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn" className="hover:text-neutral-800 dark:hover:text-neutral-200">
                <Linkedin className="w-5 h-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href={profileData.social.email} aria-label="Email" title="Email" className="hover:text-neutral-800 dark:hover:text-neutral-200">
                <Mail className="w-5 h-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  )
}
