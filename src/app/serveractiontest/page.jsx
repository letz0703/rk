import {orderKonyack} from "@/lib/action"

const ServerActonTestPage = () => {
  return (
    <div className="text-red-300">
      <form action={orderKonyack} className="action">
        <input type="text" placeholder="신청 아이템" name="items" />
        <input type="text" placeholder="전화번호" name="phone" />
        <input type="text" placeholder="개인통관번호" name="csnum" />
        <button>주문하기</button>
      </form>
    </div>
  )
}
export default ServerActonTestPage
