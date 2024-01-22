import { FormExample } from "@/components/FormExample";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex h-screen justify-center items-center">
      <Card className="w-1/2 mx-auto">
        <FormExample />
      </Card>
    </main>
  );
}
