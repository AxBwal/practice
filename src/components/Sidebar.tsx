import React from 'react';

interface Meal {
  title: string;
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

interface SidebarProps {
  meal: Meal | null;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ meal, onClose }) => {
  if (!meal) return null;

  // Ensure tags are properly formatted
  const tags = meal.content && meal.content.strTags ? meal.content.strTags.split(',') : [];

  return (
    <div
      className="sidebar p-4"
      style={{
        width: '380px',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        position: 'relative',
        padding: '20px',
        backgroundColor: '#fff',
        boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.15)',
        marginRight: '20px',
      }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          fontSize: '24px',
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          color: '#333',
        }}
        aria-label="Close"
      >
        &times;
      </button>

      <h2 className="text-2xl font-bold mb-4" style={{ marginTop: '10px', fontSize: '22px' }}>
  {meal.title || 'No Title'}
</h2>


      {/* Only render image if strMealThumb is available */}
      {meal.content.strMealThumb && (
        <img
          src={meal.content.strMealThumb}
          alt={meal.content.strMeal}
          style={{
            width: '100%',
            maxWidth: '100%',
            height: 'auto',
            marginBottom: '15px',
            borderRadius: '10px',
          }}
        />
      )}

      {/* Display Tags */}
      {tags.length > 0 && (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
          {tags.map((tag: string, index: number) => (
            <span
              key={index}
              style={{
                backgroundColor: tagColors[index % tagColors.length], // Colorful tags
                color: '#fff',
                padding: '5px 10px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Display Category and Area */}
      <h3 className="text-xl font-semibold mb-2" style={{ marginBottom: '10px' }}>
        Category: {meal.content.strCategory || 'N/A'}
      </h3>
      <h3 className="text-xl font-semibold mb-2" style={{ marginBottom: '10px' }}>
        Area: {meal.content.strArea || 'N/A'}
      </h3>

      {/* Display YouTube and Recipe Links */}
      {meal.content.strYoutube && (
        <p style={{ marginBottom: '10px', wordWrap: 'break-word' }}>
          <strong>YouTube: </strong>
          <a
            href={meal.content.strYoutube}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#007BFF', textDecoration: 'underline' }}
          >
            Watch video
          </a>
        </p>
      )}

      {meal.content.strSource && (
        <p style={{ marginBottom: '20px', wordWrap: 'break-word' }}>
          <strong>Recipe: </strong>
          <a
            href={meal.content.strSource}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#007BFF', textDecoration: 'underline' }}
          >
            View recipe
          </a>
        </p>
      )}

      {/* Display Instructions */}
      <div
        style={{
          backgroundColor: '#f9f9f9',
          padding: '15px',
          borderRadius: '10px',
          marginBottom: '20px',
          border: '1px solid #eee',
        }}
      >
        <h3 className="text-xl font-semibold">Instructions</h3>
        <p style={{ wordWrap: 'break-word' }}>{meal.content.strInstructions || 'No instructions available'}</p>
      </div>
    </div>
  );
};

// Define an array of colors to rotate through for tags
const tagColors = ['#FF6B6B', '#6BCB77', '#4D96FF', '#F5A623', '#FF8C42'];

export default Sidebar;
