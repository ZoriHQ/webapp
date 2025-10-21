import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeletePaymentProvider } from '@/hooks/use-payment-providers'
import { getProviderName } from '@/lib/payment-provider-icons'
import { toast } from 'sonner'
import type Zoriapi from 'zorihq'

interface DeleteProviderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  provider: Zoriapi.V1.PaymentProviders.PaymentProviderResponse | null
}

export function DeleteProviderDialog({
  open,
  onOpenChange,
  provider,
}: DeleteProviderDialogProps) {
  const deleteProvider = useDeletePaymentProvider()

  const handleDelete = async () => {
    if (!provider?.id) {
      return
    }

    try {
      await deleteProvider.mutateAsync({ id: provider.id })

      toast.success(`${getProviderName(provider.provider_type)} disconnected successfully`)
      onOpenChange(false)
    } catch (error) {
      toast.error('Failed to disconnect provider. Please try again.')
      console.error('Error deleting provider:', error)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Disconnect Payment Provider</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to disconnect{' '}
            <strong>{provider ? getProviderName(provider.provider_type) : 'this provider'}</strong>?
            This will stop revenue tracking from this payment provider.
            <br />
            <br />
            This action cannot be undone. You can always reconnect the provider later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteProvider.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteProvider.isPending ? 'Disconnecting...' : 'Disconnect'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
