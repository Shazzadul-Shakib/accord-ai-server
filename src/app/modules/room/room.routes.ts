import { Router } from "express";
import { roomController } from "./room.controller";
import { authGuard } from "../../middleware/authGuard";

export const roomRouter = Router();

roomRouter.delete('/:roomId',authGuard(),roomController.deleteChatRoom);
