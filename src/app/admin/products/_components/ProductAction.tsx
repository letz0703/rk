"use client"
import {DropdownMenu, DropdownMenuItem} from "@radix-ui/react-dropdown-menu"
import {startTransition, useTransition} from "react"
import {
  deleteProduct,
  toggleProductAvailablibility
} from "../../_actions/products"
import {useRouter} from "next/navigation"

export function ActiveToggleDropdownItem({
  id,
  isAvailableForPurchase
}: {
  id: string
  isAvailableForPurchase: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await toggleProductAvailablibility(id, !isAvailableForPurchase)
          router.refresh()
        })
      }}
    >
      {isAvailableForPurchase ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
  )
}

export function DeleteDropdownItem({
  id,
  disabled
}: {
  id: string
  disabled: boolean
  //isAvailableForPurchase: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  return (
    <DropdownMenuItem
      //variant="destructive"
      className="text-red-600 hover:bg-red-900 focus:bg-red-900  focus:text-white"
      disabled={disabled || isPending}
      onClick={() => {
        startTransition(async () => {
          await deleteProduct(id)
          router.refresh()
        })
      }}
    >
      Delete
    </DropdownMenuItem>
  )
}
