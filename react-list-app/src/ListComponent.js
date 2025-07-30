const ListComponent = ({ items, renderItem }) => (
  <ul>
    {items.map(item => (
      <li key={item.id}>
        {renderItem ? renderItem(item) : item.name || item.title}
      </li>
    ))}
  </ul>
);

export default ListComponent;
