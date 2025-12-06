export default function Chip(props) {
  return (
    <div
      className={props.class}
      style={{ backgroundColor: props.backgroundColor, color: props.color }}
    >
      {props.name}
    </div>
  );
}
