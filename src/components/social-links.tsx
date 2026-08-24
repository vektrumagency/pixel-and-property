function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className={className}
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4.3" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.1c.53-.95 1.83-1.95 3.77-1.95C20.6 8.75 21 11.1 21 14.05V21h-4v-6.2c0-1.48-.03-3.38-2.06-3.38-2.07 0-2.39 1.62-2.39 3.28V21H9V9Z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.8 8s-.2-1.4-.8-2.02c-.77-.8-1.63-.8-2.02-.85C16.2 5 12 5 12 5h-.01s-4.2 0-6.98.13c-.39.05-1.25.05-2.02.85C2.4 6.6 2.2 8 2.2 8S2 9.64 2 11.28v1.44c0 1.64.2 3.28.2 3.28s.2 1.4.8 2.02c.77.8 1.78.78 2.23.86 1.62.16 6.77.21 6.77.21s4.2-.01 6.98-.14c.39-.05 1.25-.05 2.02-.85.6-.62.8-2.02.8-2.02s.2-1.64.2-3.28v-1.44C22 9.64 21.8 8 21.8 8ZM9.98 14.98v-5l4.8 2.51-4.8 2.49Z"
      />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.6 2h-3.2v13.6a2.9 2.9 0 1 1-2.06-2.78V9.6a6.1 6.1 0 1 0 5.26 6.04V8.9a8.3 8.3 0 0 0 4.6 1.4V7.1a5.1 5.1 0 0 1-4.6-5.1Z" />
    </svg>
  );
}

export const socials = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/pixelandproperty/",
    icon: InstagramIcon,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/pixelandproperty/?viewAsMember=true",
    icon: LinkedInIcon,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/pixelandproperty",
    icon: FacebookIcon,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@pixelandproperty",
    icon: YouTubeIcon,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@_pixelandproperty",
    icon: TikTokIcon,
  },
] as const;
