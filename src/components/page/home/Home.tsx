import { Button } from "@/components/ui/chakraui/button";
import { useColorMode } from "@/components/ui/chakraui/color-mode";
import { Sidebar } from "@/components/layout/Sidebar";

export const Home = () => {
  const { toggleColorMode } = useColorMode();
  const mockArray = [
    {
      id: "1",
      date: "2024-12-20",
      title: "研究",
    },
  ];

  return (
    <div>
      <Sidebar chats={mockArray} onClick={(id) => console.log(id)} />
      {/* Home
      <Button onClick={toggleColorMode}>Toggle Mode</Button> */}
    </div>
  );
};
