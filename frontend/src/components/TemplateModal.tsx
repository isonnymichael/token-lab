import { X, LayoutTemplate } from 'lucide-react';
import { TOKEN_TEMPLATES, type TokenTemplate } from '../blocks/templates';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (xmlString: string) => void;
}

export default function TemplateModal({ isOpen, onClose, onSelect }: TemplateModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-800 font-bold text-lg">
            <LayoutTemplate className="text-blue-500" />
            Select a Starting Template
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:cursor-pointer hover:text-gray-600 hover:bg-gray-100 p-1 rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-gray-50 flex-1 overflow-y-auto">
          <p className="text-gray-500 text-sm mb-6">
            Choose a pre-configured tokenomics template to jumpstart your workspace.
            <strong> Warning: This will overwrite your current workspace.</strong>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TOKEN_TEMPLATES.map((template: TokenTemplate) => (
              <div
                key={template.id}
                onClick={() => onSelect(template.xml)}
                className="group bg-white border border-gray-200 rounded-lg p-5 cursor-pointer hover:border-blue-500 hover:ring-1 hover:ring-blue-500 hover:shadow-md transition-all text-left flex flex-col h-full"
              >
                <h3 className="font-bold text-gray-800 text-base mb-2 group-hover:text-blue-600 transition-colors">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-500 flex-1">
                  {template.description}
                </p>
                <div className="mt-4 text-xs font-semibold text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Load Template &rarr;
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
