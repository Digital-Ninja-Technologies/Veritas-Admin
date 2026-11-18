import { FaqItemActions } from "@/components/support/faq-item-actions";
import { titleCase } from "@/lib/format";
import type { FaqEntry } from "@/lib/types";

export function FaqList({ faqs }: { faqs: FaqEntry[] }) {
  if (faqs.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">No FAQs yet.</p>;
  }

  return (
    <div className="flex flex-col divide-y">
      {faqs.map((faq) => (
        <div key={faq.id} className="flex items-start justify-between gap-3 py-3">
          <details className="group min-w-0 flex-1">
            <summary className="flex cursor-pointer list-none items-start gap-3">
              <span className="mt-0.5 w-16 shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {titleCase(faq.category)}
              </span>
              <span className="text-sm font-medium">{faq.question}</span>
            </summary>
            <p className="mt-2 pl-[4.5rem] text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
          </details>
          <FaqItemActions faq={faq} />
        </div>
      ))}
    </div>
  );
}
