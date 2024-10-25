import { withAppLayout } from "./components";
import { Home, Chat, Setting } from "./pages";

// Enhanced routes with layout applied
const EnhancedHome = withAppLayout(Home);
const EnhancedChat = withAppLayout(Chat);
const EnhancedSetting = withAppLayout(Setting);

export { EnhancedHome, EnhancedChat, EnhancedSetting };
