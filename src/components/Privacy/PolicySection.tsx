import * as React from "react";

interface PolicySectionProps {
  title: string;
  content: React.ReactNode;
  children?: React.ReactNode;
}

export function PolicySection({
  title,
  content,
  children,
}: PolicySectionProps) {
  return (
    <section className="mb-8">
      <h2 className="mb-2.5 text-xl md:text-xl font-bold">{title}</h2>
      <div className="text-sm sm:text-base">{content}</div>
      {children}
    </section>
  );
}