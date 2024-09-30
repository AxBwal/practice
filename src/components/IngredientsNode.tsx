

const IngredientsNode = ({ data }: any) => {
  return (
    <div className="bg-purple-500 text-white p-4 rounded-lg">
      {data.label}
    </div>
  );
};

export default IngredientsNode;
