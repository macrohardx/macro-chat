import { RootComponent } from '../components/root/root.component';
import { HomeComponent } from '../components/home/home.component';
import { UserSettingsComponent } from '../components/user-settings/user-settings.component';

export const AppStates = [
    {
        abstract: true,
        name: 'root',
        url: '',
        views: {
            '@': { component: RootComponent }
        }
    },
    {
        parent: 'root',
        name: 'home',
        url: '/home',
        views: {
            'main@root': { component: HomeComponent }
        }
    }
    ,
    {
        parent: 'root',
        name: 'user-settings',
        url: '/user-settings',
        views: {
            'main@root': { component: UserSettingsComponent }
        }
    }
]