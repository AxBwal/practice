

const CategoryNode = ({ data }: any) => {
  return (
    <div className="bg-blue-500 text-white p-4 rounded-lg">
      {data.label}
    </div>
  );
};

export default CategoryNode;
