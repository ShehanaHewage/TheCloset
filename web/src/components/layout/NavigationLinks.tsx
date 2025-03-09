import { Link } from '@tanstack/react-router';

interface NavigationLinksProps {
  className?: string;
  linkClassName?: string;
}

export function NavigationLinks({ className, linkClassName }: NavigationLinksProps) {
  const links = [
    { href: '/catalog?type=skirt', label: 'Skirts' },
    { href: '/catalog?type=tshirt', label: 'T-Shirts' },
    { href: '/catalog?type=shirt', label: 'Shirts' },
    { href: '/catalog?type=jeans', label: 'Jeans' },
    { href: '/catalog?type=trousers', label: 'Trousers' },
    { href: '/catalog?type=shorts', label: 'Shorts' },
    { href: '/catalog?type=jacket', label: 'Jackets' },
    { href: '/catalog?type=coat', label: 'Coats' },
    { href: '/catalog?type=blazer', label: 'Blazers' },
  ];

  return (
    <nav className={className}>
      {links.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          className={linkClassName || 'text-white/80 hover:text-white transition-colors'}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
