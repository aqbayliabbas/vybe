import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <Section title="Brand profile" desc="How your brand appears across Vybe.">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-vybe/25 to-vybe-glow/15 text-lg font-bold text-vybe-dark">PA</div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full border-border/60 bg-white/70">Upload new</Button>
            <Button variant="ghost" className="rounded-full text-muted-foreground">Remove</Button>
          </div>
        </div>
        <Field label="Brand name" defaultValue="Pepsi Algeria" />
        <Field label="Industry" defaultValue="Food & Beverage" />
        <Field label="Website" defaultValue="https://pepsi.dz" />
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-foreground">Bio</label>
          <textarea
            rows={3}
            defaultValue="Refreshing Algeria, one moment at a time."
            className="w-full rounded-2xl border border-border/60 bg-white/70 px-4 py-2.5 text-[13px] outline-none focus:border-vybe/40 focus:bg-white"
          />
        </div>
      </Section>

      <Section title="Contact" desc="Used for account-related communications.">
        <Field label="Full name" defaultValue="Ahmed Belkacem" />
        <Field label="Email" type="email" defaultValue="ahmed@pepsi.dz" />
        <Field label="Phone" defaultValue="+213 555 12 34 56" />
      </Section>

      <div className="flex justify-end gap-2">
        <Button variant="ghost" className="rounded-full">Cancel</Button>
        <Button className="rounded-full bg-gradient-to-br from-vybe to-vybe-glow px-6 text-white">Save changes</Button>
      </div>
    </div>
  );
}

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border/40 bg-white/90 p-6 shadow-card">
      <div className="mb-5">
        <h3 className="font-heading text-base font-semibold text-foreground">{title}</h3>
        <p className="text-[12px] text-muted-foreground">{desc}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-foreground">{label}</label>
      <Input {...props} className="rounded-2xl border-border/60 bg-white/70" />
    </div>
  );
}
