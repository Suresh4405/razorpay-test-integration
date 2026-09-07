import { ShieldCheck } from "lucide-react";

export default function TrustStrip() {
  return (
    <div className="bg-ink text-paper">
      <p className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 text-center text-[11.5px] tracking-wide text-paper/85 sm:px-6">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-brass-light" />
        Real email verification · This is a demo storefront running Razorpay in test mode — no real payments are taken.
      </p>
    </div>
  );
}