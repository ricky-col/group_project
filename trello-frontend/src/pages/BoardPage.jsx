import { useParams } from "react-router-dom";
import Board from "../components/Board/Board";

export default function BoardPage() {
  const { id } = useParams();

  return <Board boardId={id} />;
}