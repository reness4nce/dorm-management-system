import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UseFormReturn } from 'react-hook-form';

type ChecklistFormProps = {
    form: UseFormReturn<{
        residentId?: string;
        reason?: string;
        intendedDate?: Date;
        intendedTime?: string;
        returnDate?: Date;
        returnTime?: string;
        notes?: string;
        clearanceItems?: { id?: string; name?: string; isCompleted?: boolean }[];
    }>;
};

export default function ChecklistForm({ form }: ChecklistFormProps) {
    const [items, setItems] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [errors, setErrors] = useState<{ input?: string }>({});

    const addItem = () => {
        if (!inputValue.trim()) {
            setErrors({ input: 'Please enter an item description' });
            return;
        }

        setItems([...items, { id: Date.now(), name: inputValue, isCompleted: false }]);
        setInputValue('');
        setErrors({});
    };

    const removeItem = (id: number) => {
        setItems(items.filter(item => item.id !== id));
    };

    const toggleCompleted = (id: number) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
        ));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="font-medium">Clearance Items for {form.getValues('residentId') || 'Resident'}</div>
                <button
                    type="button"
                    className="px-2 py-1 text-xs border rounded-md flex items-center gap-1 hover:bg-gray-100"
                    onClick={addItem}
                >
                    <Plus className="h-3 w-3" /> Add Item
                </button>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        className="flex-1 px-3 py-1 border rounded-md text-sm"
                        placeholder="Clearance item description"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                addItem();
                            }
                        }}
                    />
                </div>
                {errors.input && (
                    <p className="text-xs text-red-500">{errors.input}</p>
                )}

                {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={item.isCompleted}
                            onChange={() => toggleCompleted(item.id)}
                            className="h-4 w-4"
                        />

                        <span className={`flex-1 ${item.isCompleted ? 'line-through text-gray-400' : ''}`}>
                            {item.name}
                        </span>

                        <button
                            type="button"
                            className="p-1 text-gray-400 hover:text-gray-600"
                            onClick={() => removeItem(item.id)}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}

                {items.length === 0 && (
                    <p className="text-sm text-gray-500 py-2 text-center">
                        No clearance items added. Add items to be checked before checkout approval.
                    </p>
                )}
            </div>
        </div>
    );
}
