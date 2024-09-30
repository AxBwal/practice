

const MealNode = ({ data }: any) => {
  return (
    <div className="bg-yellow-500 text-black p-4 rounded-lg">
      {data.label}
    </div>
  );
};

export default MealNode;
