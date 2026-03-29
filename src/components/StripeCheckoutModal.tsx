import { useState } from 'react'
import { CreditCard, Lock, CheckCircle2 } from 'lucide-react'
import Modal from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { CoinPackage } from '@/types'

interface StripeCheckoutModalProps {
  pkg: CoinPackage
  onSuccess: (pkg: CoinPackage) => void
  onClose: () => void
}

// Format card number with spaces every 4 digits
function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

// Format MM/YY
function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length > 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`
  }
  return digits
}

const StripeCheckoutModal = ({ pkg, onSuccess, onClose }: StripeCheckoutModalProps) => {
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [name, setName] = useState('')
  const [processing, setProcessing] = useState(false)
  const [succeeded, setSucceeded] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    // Simulate a 1.5s payment processing delay
    setTimeout(() => {
      setProcessing(false)
      setSucceeded(true)
      setTimeout(() => {
        onSuccess(pkg)
      }, 1500)
    }, 1500)
  }

  if (succeeded) {
    return (
      <Modal title="Payment Successful" onClose={onClose}>
        <div className="py-6 text-center">
          <div className="w-14 h-14 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7 text-success" />
          </div>
          <p className="font-semibold text-foreground text-lg mb-1">Payment confirmed!</p>
          <p className="text-sm text-muted-foreground">
            <span className="text-success font-bold">🪙 {pkg.coins} coins</span> have been added to your account.
          </p>
        </div>
      </Modal>
    )
  }

  return (
    <Modal title="Secure Checkout" onClose={onClose}>
      {/* Stripe branding strip */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-border">
        <div>
          <p className="text-xs text-muted-foreground">Paying for</p>
          <p className="font-semibold text-foreground">{pkg.label} — 🪙 {pkg.coins} coins</p>
        </div>
        <p className="text-2xl font-extrabold text-foreground">${pkg.price}</p>
      </div>

      <div className="flex items-center gap-1.5 mb-4 text-xs text-muted-foreground">
        <Lock className="w-3 h-3" />
        Secured by <span className="font-semibold text-primary">Stripe</span> (simulated)
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="card-name">Name on card</Label>
          <Input
            id="card-name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="card-number">Card number</Label>
          <div className="relative">
            <Input
              id="card-number"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              required
              maxLength={19}
              className="h-11 rounded-xl pr-10"
            />
            <CreditCard className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="card-expiry">Expiry</Label>
            <Input
              id="card-expiry"
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              required
              maxLength={5}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="card-cvc">CVC</Label>
            <Input
              id="card-cvc"
              placeholder="123"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
              required
              maxLength={3}
              className="h-11 rounded-xl"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={processing}
          className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all duration-200 mt-2"
        >
          {processing ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
              Processing…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4" /> Pay ${pkg.price}
            </span>
          )}
        </Button>
      </form>
    </Modal>
  )
}

export default StripeCheckoutModal
