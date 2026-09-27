package expo.modules.lingocatstreakwidget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.os.Build
import android.widget.RemoteViews

class LingoCatStreakWidgetProvider : AppWidgetProvider() {
  override fun onUpdate(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetIds: IntArray
  ) {
    appWidgetIds.forEach { widgetId ->
      updateWidget(context, appWidgetManager, widgetId)
    }
  }

  override fun onEnabled(context: Context) {
    super.onEnabled(context)
    updateAllWidgets(context)
  }

  companion object {
    private const val PREFS_NAME = "lingocat_streak_widget"
    private const val KEY_STREAK = "streak_count"

    fun saveStreak(context: Context, streakCount: Int) {
      context
        .getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        .edit()
        .putInt(KEY_STREAK, streakCount.coerceAtLeast(0))
        .apply()
    }

    fun getStreak(context: Context): Int {
      return context
        .getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        .getInt(KEY_STREAK, 0)
        .coerceAtLeast(0)
    }

    fun updateAllWidgets(context: Context) {
      val manager = AppWidgetManager.getInstance(context)
      val component = ComponentName(context, LingoCatStreakWidgetProvider::class.java)
      val ids = manager.getAppWidgetIds(component)

      ids.forEach { widgetId ->
        updateWidget(context, manager, widgetId)
      }
    }

    private fun updateWidget(
      context: Context,
      manager: AppWidgetManager,
      widgetId: Int
    ) {
      val streak = getStreak(context)
      val views = RemoteViews(context.packageName, R.layout.lingocat_streak_widget)

      views.setTextViewText(R.id.widget_streak_count, streak.toString())
      views.setTextViewText(
        R.id.widget_message,
        when (streak) {
          0 -> "Complete a lesson today"
          1 -> "Great start — keep it alive tomorrow!"
          else -> "Keep your $streak-day streak alive!"
        }
      )

      val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName)
      if (launchIntent != null) {
        launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
        val flags = PendingIntent.FLAG_UPDATE_CURRENT or
          if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE else 0
        val pendingIntent = PendingIntent.getActivity(context, 1001, launchIntent, flags)
        views.setOnClickPendingIntent(R.id.widget_root, pendingIntent)
      }

      manager.updateAppWidget(widgetId, views)
    }
  }
}
