// server action has to be async 2024.03.30 토
export const orderKonyack = async formData => {
  "use server"
  const {items, phone, csnum, userId} = Object.fromEntreis(formData)
  try {
    //connectToDb();
    const newOrder = new Order({
      items,
      phone,
      csname,
      userId
    })
    await newOrder.save()
    console.log("saved to db")
    items, phone, csnum, userId
    revalidatePath("/order")
  } catch (err) {}
  console.log(items, phone, csnum, userId)
}
