package expo.modules.lingocatstreakwidget

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.os.Build
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class LingoCatStreakWidgetModule : Module() {
  private fun context(): Context? = appContext.reactContext ?: appContext.currentActivity

  override fun definition() = ModuleDefinition {
    Name("LingoCatStreakWidget")

    Function("updateStreakWidget") { streakCount: Int ->
      val context = context() ?: return@Function false
      val safeStreak = streakCount.coerceAtLeast(0)

      LingoCatStreakWidgetProvider.saveStreak(context, safeStreak)
      LingoCatStreakWidgetProvider.updateAllWidgets(context)
      true
    }

    Function("getStreakCount") {
      val context = context() ?: return@Function 0
      LingoCatStreakWidgetProvider.getStreak(context)
    }

    Function("refreshWidget") {
      val context = context() ?: return@Function false
      LingoCatStreakWidgetProvider.updateAllWidgets(context)
      true
    }

    Function("isWidgetAdded") {
      val context = context() ?: return@Function false
      val manager = AppWidgetManager.getInstance(context)
      val provider = ComponentName(context, LingoCatStreakWidgetProvider::class.java)
      manager.getAppWidgetIds(provider).isNotEmpty()
    }

    Function("requestPinWidget") {
      val context = context() ?: return@Function false

      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
        return@Function false
      }

      val manager = AppWidgetManager.getInstance(context)
      if (!manager.isRequestPinAppWidgetSupported) {
        return@Function false
      }

      val provider = ComponentName(context, LingoCatStreakWidgetProvider::class.java)
      manager.requestPinAppWidget(provider, null, null)
    }
  }
}
