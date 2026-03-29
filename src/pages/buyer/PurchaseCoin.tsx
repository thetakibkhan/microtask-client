import { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { coinPackages } from '@/mocks/buyer'
import type { CoinPackage } from '@/types'

interface PurchaseCoinProps {
  onPurchase: (pkg: CoinPackage) => void
}

const PurchaseCoin = ({ onPurchase }: PurchaseCoinProps) => {
  const [selected, setSelected] = useState<string>(coinPackages[2].id)
  const [confirmed, setConfirmed] = useState(false)

  const selectedPkg = coinPackages.find((p) => p.id === selected)

  const handleBuy = () => {
    if (!selectedPkg) return
    onPurchase(selectedPkg)
    setConfirmed(true)
    setTimeout(() => setConfirmed(false), 3000)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">Purchase Coins</h1>
      <p className="text-sm text-muted-foreground mb-8">Choose a coin package to fund your campaigns.</p>

      {confirmed && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-success/10 border border-success/20 text-success text-sm font-medium"
        >
          <CheckCircle2 className="w-4 h-4" />
          Purchase successful! Coins added to your balance.
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {coinPackages.map((pkg) => (
          <button
            key={pkg.id}
            type="button"
            onClick={() => setSelected(pkg.id)}
            className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
              selected === pkg.id
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card hover:border-primary/40'
            }`}
          >
            <p className="font-bold text-foreground text-lg mb-1">{pkg.label}</p>
            <p className="text-3xl font-extrabold tabular-nums text-primary mb-1">
              🪙 {pkg.coins}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">${pkg.price}</span> USD
            </p>
            {selected === pkg.id && (
              <div className="mt-3">
                <span className="inline-flex px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-bold border border-primary/20">
                  SELECTED
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="max-w-sm bg-card rounded-2xl orbit-shadow p-6">
        <h2 className="font-semibold text-foreground mb-4">Order Summary</h2>
        {selectedPkg && (
          <div className="space-y-2 text-sm mb-5">
            <div className="flex justify-between text-muted-foreground">
              <span>Package</span>
              <span className="text-foreground font-medium">{selectedPkg.label}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Coins</span>
              <span className="text-success font-semibold">🪙 {selectedPkg.coins}</span>
            </div>
            <div className="flex justify-between text-muted-foreground border-t border-border pt-2 mt-2">
              <span>Total</span>
              <span className="text-foreground font-bold">${selectedPkg.price}</span>
            </div>
          </div>
        )}
        <Button
          onClick={handleBuy}
          className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all duration-200"
        >
          <CreditCard className="w-4 h-4 mr-2" /> Buy Now
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-3">
          Payments are simulated — no real money is charged.
        </p>
      </div>
    </motion.div>
  )
}

export default PurchaseCoin
