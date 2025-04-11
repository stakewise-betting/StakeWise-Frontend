interface TermsListProps {
  items: string[];
}

export function TermsList({ items }: TermsListProps) {
  return (
    <ul className="pl-5 mt-2.5 list-disc">
      {items.map((item, index) => (
        <li key={index} className="mb-2">{item}</li>
      ))}
    </ul>
  );
}
