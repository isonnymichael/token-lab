import { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly/core';
import * as En from 'blockly/msg/en';
import { defineTokenBlocks, INITIAL_TOOLBOX } from '../blocks/tokenBlocks';
import { generateTokenConfig } from '../blocks/generator';
import { validateTokenWorkspace } from '../blocks/validation';
import { useAppState } from '../context/AppContext';
import TemplateModal from './TemplateModal';

// Initialize English messages
Blockly.setLocale(En as any);

// Setup our custom blocks
defineTokenBlocks();

// Custom Theme to mimic Scratch/Modern style slightly
const scratchTheme = Blockly.Theme.defineTheme('scratch_theme', {
  name: 'scratch_theme',
  base: Blockly.Themes.Classic,
  blockStyles: {},
  categoryStyles: {},
  componentStyles: {
    workspaceBackgroundColour: '#EEF2F5',
    toolboxBackgroundColour: '#ffffff',
    toolboxForegroundColour: '#4b5563',
    flyoutBackgroundColour: '#f9fafb',
    flyoutForegroundColour: '#4b5563',
    insertionMarkerColour: '#3b82f6',
    markerColour: '#3b82f6'
  },
  fontStyle: {
    family: 'ui-sans-serif, system-ui, sans-serif',
    weight: 'bold',
    size: 13,
  },
  startHats: true,
});

export default function BlocklyWorkspace() {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const { setValidation, setConfig } = useAppState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const runValidationAndGeneration = (workspace: Blockly.Workspace) => {
    // 1. Run Validation
    const { isValid, errors } = validateTokenWorkspace(workspace);
    setValidation(isValid, errors);

    if (isValid) {
      // 2. Run Generator if valid
      try {
        const jsonString = generateTokenConfig(workspace);
        console.log('Valid Config Generated:', jsonString);
        if (jsonString && jsonString.trim().length > 2) {
          const parsed = JSON.parse(jsonString);
          setConfig(parsed);
        } else {
          setConfig({});
        }
      } catch (e) {
        console.error("Failed to parse config", e);
      }
    }
  };

  useEffect(() => {
    if (!blocklyDiv.current) return;

    workspaceRef.current = Blockly.inject(blocklyDiv.current, {
      toolbox: INITIAL_TOOLBOX,
      theme: scratchTheme,
      renderer: 'zelos', // 'zelos' is the built-in scratch-like renderer
      grid: {
        spacing: 20,
        length: 2,
        colour: '#CBD5E1',
        snap: true,
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2,
      },
      trashcan: true,
      move: {
        scrollbars: true,
        drag: true,
        wheel: true
      }
    });

    // Handle workspace changes to trigger validation and JSON generation
    workspaceRef.current.addChangeListener((e) => {
      if (e.isUiEvent || e.type === Blockly.Events.FINISHED_LOADING) return;

      const workspace = workspaceRef.current;
      if (!workspace) return;

      runValidationAndGeneration(workspace);
    });

    return () => {
      workspaceRef.current?.dispose();
    };
  }, []);

  const handleLoadTemplate = (xmlString: string) => {
    if (!workspaceRef.current) return;
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");

      Blockly.Events.disable();
      workspaceRef.current.clear();
      Blockly.Xml.domToWorkspace(xmlDoc.documentElement, workspaceRef.current);
      Blockly.Events.enable();

      setIsModalOpen(false);

      // Force an update to the UI Since we disabled events during load
      runValidationAndGeneration(workspaceRef.current);

    } catch (e) {
      console.error("Failed to load template", e);
    }
  };

  return (
    <div className="flex-1 relative flex flex-col min-w-0">

      <TemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleLoadTemplate}
      />

      {/* Breadcrumbs / Info */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-white/80 hover:bg-white backdrop-blur rounded-md px-3 py-1.5 text-xs font-semibold text-blue-600 shadow-sm border border-gray-200 transition-colors cursor-pointer active:scale-95"
        >
          Templates
        </button>
      </div>

      {/* The Blockly Injection Div */}
      <div
        ref={blocklyDiv}
        className="absolute inset-0 z-0 [&_.blocklyToolboxDiv]:border-r [&_.blocklyToolboxDiv]:border-gray-200"
      />
    </div>
  );
}

