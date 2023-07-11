import * as AlertDialog from '../components/AlertDialog'

const AlertDialogDemo = () => (
  <AlertDialog.Root>
    <AlertDialog.Trigger asChild>
      <button>
        Delete account
      </button>
    </AlertDialog.Trigger>
    <AlertDialog.Portal>
      <AlertDialog.Overlay />
      <AlertDialog.Content>
        <AlertDialog.Title>
          Are you absolutely sure?
        </AlertDialog.Title>
        <AlertDialog.Description>
          This action cannot be undone. This will permanently delete your account and remove your
          data from our servers.
        </AlertDialog.Description>
        <div className="flex justify-end gap-[25px]">
          <AlertDialog.Cancel asChild>
            <button>
              Cancel
            </button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <button>
              Yes, delete account
            </button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
)

export default AlertDialogDemo