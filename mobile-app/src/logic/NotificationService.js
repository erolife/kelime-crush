import { LocalNotifications } from '@capacitor/local-notifications';

export const NotificationService = {
    /**
     * Bildirim izinlerini kontrol eder ve ister
     */
    async requestPermissions() {
        try {
            const { display } = await LocalNotifications.checkPermissions();
            if (display !== 'granted') {
                const { display: newDisplay } = await LocalNotifications.requestPermissions();
                return newDisplay === 'granted';
            }
            return true;
        } catch (error) {
            console.error('Error requesting notification permissions:', error);
            return false;
        }
    },

    /**
     * Enerji dolduğunda gönderilecek bildirimi zamanlar
     * @param {number} secondsToFull - Tam doluma kalan saniye
     * @param {string} language - Uygulama dili ('tr' | 'en')
     */
    async scheduleEnergyFullNotification(secondsToFull, language = 'tr') {
        if (secondsToFull <= 0) return;

        try {
            // Önceki enerji bildirimlerini temizle
            await this.cancelEnergyNotifications();

            const permission = await this.requestPermissions();
            if (!permission) return;

            const title = language === 'tr' ? 'Enerji Doldu!' : 'Energy Full!';
            const body = language === 'tr'
                ? 'Enerjin tamamen doldu (5/5). Hemen oynamaya dön!'
                : 'Your energy is fully recharged (5/5). Return to play now!';

            await LocalNotifications.schedule({
                notifications: [
                    {
                        id: 1001, // Sabit ID (enerji bildirimi için)
                        title,
                        body,
                        schedule: {
                            at: new Date(Date.now() + secondsToFull * 1000),
                            allowWhileIdle: true,
                        },
                        sound: 'default',
                        attachments: [],
                        extra: {
                            type: 'energy_refill'
                        }
                    }
                ]
            });

            console.log(`Notification scheduled for ${secondsToFull} seconds later.`);
        } catch (error) {
            console.error('Error scheduling notification:', error);
        }
    },

    /**
     * Zamanlanmış enerji bildirimlerini iptal eder
     */
    async cancelEnergyNotifications() {
        try {
            await LocalNotifications.cancel({
                notifications: [{ id: 1001 }]
            });
        } catch (error) {
            console.error('Error canceling notifications:', error);
        }
    }
};
