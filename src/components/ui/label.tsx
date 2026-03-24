import React from 'react'

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={`text-sm font-medium text-foreground ${className}`}
        {...props}
      >
        {children}
      </label>
    )
  }
)

Label.displayName = 'Label'

export { Label }
