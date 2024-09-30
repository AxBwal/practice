import React, { useState, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType,
} from 'react-flow-renderer';
import Sidebar from './Sidebar';
import { getCategories, getMealsByCategory, getMealDetails } from '../api/foodApi';

// Define the structure of the API responses for better TypeScript support
interface Category {
  strCategory: string;
}

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb?: string;
  strCategory?: string;
  strTags?: string;
  strInstructions?: string;
  strYoutube?: string;
  strSource?: string;
  ingredients?: string[];
  title: string; // Make sure this is always a string
  content: {
    strMealThumb?: string;
    strMeal?: string;
    strTags?: string;
    strCategory?: string;
    strArea?: string;
    strYoutube?: string;
    strSource?: string;
    strInstructions?: string;
  };
}

// Define the initial node and edge types
interface NodeData {
  label: string;
  icon: string;
  category?: string;
  mealCategory?: string;
  mealId?: string;
}

// Icons for nodes
const exploreIcon = "https://path/to/explore-icon.png";
const categoryIcon = "https://path/to/category-icon.png";
const mealIcon = "https://path/to/meal-icon.png";

const initialNodes: Node<NodeData>[] = [
  {
    id: '1',
    type: 'explore',
    data: { label: 'Explore', icon: exploreIcon },
    position: { x: 250, y: 5 },
  },
];

// Utility function to dynamically calculate positions with spacing
const calculatePosition = (baseX: number, baseY: number, index: number, xGap = 200, yGap = 100) => {
  return { x: baseX + xGap, y: baseY + index * yGap };
};

const NodeGraph: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const collapseFlow = (categoryId: string) => {
    setNodes((nds) =>
      nds.filter(
        (n) =>
          !(
            (n.type === 'meal' && n.data.category === categoryId) ||
            (n.type === 'option' && n.data.mealCategory === categoryId) ||
            (n.type === 'entity' && n.data.mealCategory === categoryId)
          )
      )
    );
    setEdges((eds) => eds.filter((e) => !e.source.includes(categoryId)));
  };

  const onNodeClick = useCallback(async (_event: React.MouseEvent, node: Node<NodeData>) => {
    if (node.type === 'explore') {
      const categories: Category[] = (await getCategories()).slice(0, 5);

      const newCategoryNodes: Node<NodeData>[] = categories.map((cat, index) => ({
        id: cat.strCategory,
        type: 'category',
        data: { label: cat.strCategory, icon: categoryIcon },
        position: calculatePosition(250, 150, index),
        style: { backgroundColor: '#FFDDC1', color: '#333', borderRadius: '8px' },
      }));

      const newEdges: Edge[] = categories.map((cat) => ({
        id: `e1-${cat.strCategory}`,
        source: '1',
        target: cat.strCategory,
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#000', strokeWidth: 2 },
      }));

      setNodes((nds) => nds.concat(newCategoryNodes));
      setEdges((eds) => eds.concat(newEdges));
    } else if (node.type === 'category') {
      if (activeCategory && activeCategory !== node.id) {
        collapseFlow(activeCategory);
      }

      setActiveCategory(node.id);

      const meals: Meal[] = (await getMealsByCategory(node.data.label)).slice(0, 5);

      const newMealNodes: Node<NodeData>[] = meals.map((meal, index) => ({
        id: meal.idMeal,
        type: 'meal',
        data: { label: meal.strMeal, icon: mealIcon, category: node.id },
        position: calculatePosition(450, 150, index),
        style: { backgroundColor: '#FFF4E1', color: '#333', borderRadius: '8px' },
      }));

      const newEdges: Edge[] = meals.map((meal) => ({
        id: `e-${node.id}-${meal.idMeal}`,
        source: node.id,
        target: meal.idMeal,
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#000', strokeWidth: 2 },
      }));

      setNodes((nds) => nds.concat(newMealNodes));
      setEdges((eds) => eds.concat(newEdges));
    } else if (node.type === 'meal') {
      const newOptionNodes: Node<NodeData>[] = [
        {
          id: `${node.id}-ingredients`,
          type: 'option',
          data: { label: 'View Ingredients', mealId: node.id, mealCategory: activeCategory!, icon: mealIcon },
          position: { x: node.position.x + 200, y: node.position.y },
        },
        {
          id: `${node.id}-tags`,
          type: 'option',
          data: { label: 'View Tags', mealId: node.id, mealCategory: activeCategory!, icon: mealIcon },
          position: { x: node.position.x + 200, y: node.position.y + 100 },
        },
        {
          id: `${node.id}-details`,
          type: 'option',
          data: { label: 'View Details', mealId: node.id, mealCategory: activeCategory!, icon: mealIcon },
          position: { x: node.position.x + 200, y: node.position.y + 200 },
        },
      ];

      const newEdges: Edge[] = newOptionNodes.map((optionNode) => ({
        id: `e-${node.id}-${optionNode.id}`,
        source: node.id,
        target: optionNode.id,
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#000', strokeWidth: 2 },
      }));

      setNodes((nds) => nds.concat(newOptionNodes));
      setEdges((eds) => eds.concat(newEdges));
    } else if (node.type === 'option') {
      const { mealId } = node.data;

      if (!mealId) return;  // Ensure mealId is defined

      if (node.id.includes('ingredients')) {
        const mealDetails: Meal = await getMealDetails(mealId);
        const ingredients = mealDetails.ingredients || [];

        const ingredientNodes: Node<NodeData>[] = ingredients.map((ingredient, index) => ({
          id: `${node.id}-ingredient-${index}`,
          type: 'entity',
          data: { label: ingredient, icon: mealIcon, mealCategory: activeCategory! },
          position: { x: node.position.x + 200, y: node.position.y + index * 100 },
          style: { backgroundColor: '#FFDDC1', color: '#333', borderRadius: '8px' },
        }));

        const ingredientEdges: Edge[] = ingredients.map((_, index) => ({
          id: `e-${node.id}-ingredient-${index}`,
          source: node.id,
          target: `${node.id}-ingredient-${index}`,
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { stroke: '#000', strokeWidth: 2 },
        }));

        setNodes((nds) => nds.concat(ingredientNodes));
        setEdges((eds) => eds.concat(ingredientEdges));
      } else if (node.id.includes('tags')) {
        const mealDetails: Meal = await getMealDetails(mealId);
        const tags = mealDetails.strTags ? mealDetails.strTags.split(',') : [];

        const tagNodes: Node<NodeData>[] = tags.map((tag, index) => ({
          id: `${node.id}-tag-${index}`,
          type: 'entity',
          data: { label: tag, icon: mealIcon, mealCategory: activeCategory! },
          position: { x: node.position.x + 200, y: node.position.y + index * 100 },
          style: { backgroundColor: '#FFF4E1', color: '#333', borderRadius: '8px' },
        }));

        const tagEdges: Edge[] = tags.map((_, index) => ({
          id: `e-${node.id}-tag-${index}`,
          source: node.id,
          target: `${node.id}-tag-${index}`,
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { stroke: '#000', strokeWidth: 2 },
        }));

        setNodes((nds) => nds.concat(tagNodes));
        setEdges((eds) => eds.concat(tagEdges));
      } else if (node.id.includes('details')) {
        const mealDetails: Meal = await getMealDetails(mealId);
        setSelectedMeal({
          ...mealDetails,  // Spread mealDetails to maintain structure
          title: mealDetails.strMeal || 'Unknown Title',  // Ensure title is always a string
          content: mealDetails,
        });
      }
    }
  }, [activeCategory, setNodes, setEdges, setSelectedMeal]);

  const closeSidebar = () => {
    setSelectedMeal(null);
  };

  return (
    <div className="container" style={{ display: 'flex', width: '100%', height: '600px' }}>
      <div style={{ flex: 1, borderRight: '2px solid #ccc' }}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            fitView
            style={{ background: '#f0f8ff' }}
          />
        </ReactFlowProvider>
      </div>

      {selectedMeal && (
        <div style={{ width: '420px' }}>
          <Sidebar meal={selectedMeal} onClose={closeSidebar} />
        </div>
      )}
    </div>
  );
};

export default NodeGraph;