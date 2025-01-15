// src/components/FollowListDialog.tsx

import { Dialog, DialogTitle, DialogContent, Button, List, ListItem, ListItemText } from "@mui/material";

interface FollowListDialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    users: string[]; 
}

const FollowListDialog: React.FC<FollowListDialogProps> = ({ open, onClose, title, users }) => {
    return(
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <List>
                    {users.map((user, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={user} />
                        </ListItem>
                    ))}
                </List>
                <Button onClick={onClose}>
                    閉じる
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default FollowListDialog;