import { useEffect, useState } from "react";

function useDiscountCountdown(start, end) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const startTime = new Date(start);
      const endTime = new Date(end);

      if (now < startTime) {
        setTimeLeft("ยังไม่เริ่มลดราคา");
        return;
      }

      if (now > endTime) {
        setTimeLeft("หมดช่วงลดราคาแล้ว");
        return;
      }

      const diff = endTime.getTime() - now.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // แก้ไขที่นี่
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60 * 60)) / (1000));

      if (days > 0) {
        setTimeLeft(`${days} วัน ${hours} ชม.`);
      } else if (hours > 0) {
        setTimeLeft(`${hours} ชม. ${minutes} นาที`);
      } else if(minutes >0){
        setTimeLeft(`${minutes} นาที`);
      }else{
        setTimeLeft(`${seconds} วินาที`);
      }
      
      
    }, 1000);

    return () => clearInterval(interval);
  }, [start, end]);

  return timeLeft;
}


export default useDiscountCountdown;

