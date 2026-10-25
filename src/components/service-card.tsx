import type { ReactNode } from "react";

type ServiceCardProps = Readonly<{
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
  learnMoreHref: string;
}>;

export function ServiceCard({
  id,
  icon,
  title,
  description,
  learnMoreHref,
}: ServiceCardProps) {
  return (
    <li className="service-card" id={id}>
      <article>
        <div aria-hidden="true" className="service-icon">
          {icon}
        </div>
        <h3>{title}</h3>
        <p>{description}</p>
        <a aria-label={`Learn more about ${title}`} href={learnMoreHref}>
          Learn More <span aria-hidden="true">→</span>
        </a>
      </article>
    </li>
  );
}
