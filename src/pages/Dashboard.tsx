import { Headings } from "@/components/Headings";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <>
      <div className="flex w-full items-center justify-between mt-12">
        <Headings
          title="Dashboard"
          description="Create and start your AI Mock Interviews."
        />
        <Link to={"/generate/create"}>
          <Button size={"sm"}>
            <Plus />
            Add new
          </Button>
        </Link>
      </div>
      <Separator className="mt-2"/>

    </>
  );
};

export default Dashboard;
