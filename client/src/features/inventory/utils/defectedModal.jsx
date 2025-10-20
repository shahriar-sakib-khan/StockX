import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DefectedExchangeModal = ({ isOpen, onClose, onConfirm, mode }) => {
  const [count, setCount] = useState(0);

  const handleConfirm = () => {
    onConfirm({ count: Number(count) });
    setCount(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
          <Dialog.Title className="text-lg font-semibold mb-2">
            {mode === "mark" ? "Mark Defected" : "Unmark Defected"}
          </Dialog.Title>
          <Input
            type="number"
            min="0"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            placeholder="Enter count"
            className="mb-4"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>
              {mode === "mark" ? "Mark" : "Unmark"}
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default DefectedExchangeModal;
