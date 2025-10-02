import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';

export default function BillingProfileDialog({ open, onOpenChange }) {
  const { user, isLoaded } = useUser();
  const [billing, setBilling] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '', city: '', country: 'Sri Lanka', currency: 'LKR'
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const required = ['firstName','lastName','email','phone','address','city','country'];

  useEffect(() => {
    if (user) {
      setBilling(prev => ({
        ...prev,
        firstName: prev.firstName || user.firstName || '',
        lastName: prev.lastName || user.lastName || '',
        email: user.primaryEmailAddress?.emailAddress || prev.email
      }));
    }
  }, [user]);

  const validate = () => {
    const e = {};
    required.forEach(f => { if(!billing[f] || (billing[f] + '').trim()==='') e[f]='Required'; });
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const handleChange = (f, v) => { setSaved(false); setBilling(p=>({...p,[f]:v})); };

  const save = () => {
    if(!validate()) return;
    setSubmitting(true);
    // Placeholder persistence - integrate API later
    setTimeout(()=>{ setSubmitting(false); setSaved(true); }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle>Billing Profile</DialogTitle>
              <DialogDescription className="mt-1 text-xs max-w-xl">
                Provide details required for checkout (PayHere identity fields). Email is read-only from your account.
              </DialogDescription>
            </div>
            {saved && <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50">Saved</Badge>}
          </div>
        </DialogHeader>
        {!isLoaded ? (
          <div className="py-16 text-center text-muted-foreground">Loading user…</div>
        ) : !user ? (
          <div className="py-16 text-center text-muted-foreground">Please sign in to manage billing.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2  gap-4 mt-4">
              {['firstName','lastName','email','phone','address','city','country','currency'].map(field => {
                const isSelect = field==='country' || field==='currency';
                const disabled = field==='email';
                return (
                  <div key={field} className={`flex flex-col gap-1 ${field==='address' ? 'md:col-span-2 lg:col-span-1' : ''}`}>
                    <label className="text-xs font-medium capitalize">{field.replace(/([A-Z])/g,' $1')} {required.includes(field) && field!=='email' ? '*' : ''}</label>
                    {isSelect ? (
                      <select
                        disabled={disabled}
                        value={billing[field]}
                        onChange={e=>handleChange(field,e.target.value)}
                        className={`h-10 rounded-md border px-3 text-sm bg-background ${errors[field] ? 'border-red-400' : ''}`}
                      >
                        {field==='country' && <>
                          <option>Sri Lanka</option><option>India</option><option>United States</option><option>United Kingdom</option>
                        </>}
                        {field==='currency' && <>
                          <option value="LKR">LKR</option><option value="USD">USD</option><option value="INR">INR</option><option value="GBP">GBP</option>
                        </>}
                      </select>
                    ) : (
                      <input
                        disabled={disabled}
                        value={billing[field]}
                        placeholder={field==='phone' ? 'e.g. +94 71 234 5678' : ''}
                        onChange={e=>handleChange(field,e.target.value)}
                        className={`h-10 rounded-md border px-3 text-sm bg-background ${disabled ? 'bg-muted/40 text-muted-foreground' : ''} ${errors[field] ? 'border-red-400' : ''}`}
                      />
                    )}
                    {errors[field] && <span className="text-[10px] text-red-500">{errors[field]}</span>}
                    {field==='email' && <span className="text-[10px] text-muted-foreground">Email comes from your account</span>}
                    {field==='currency' && <span className="text-[10px] text-muted-foreground">Transaction currency may vary.</span>}
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex items-center gap-4">
              <Button size="sm" disabled={submitting} onClick={save}>{submitting ? 'Saving…' : 'Save Billing Profile'}</Button>
              <span className="text-[11px] text-muted-foreground">* Required for checkout payload</span>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
