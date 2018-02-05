/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.itri.utils;

import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Chris
 */
public class DebugLog {
 private final static boolean DEBUG = true;    
 public static void log(Level level, Object message) {
    if (DEBUG) {
      String fullClassName = Thread.currentThread().getStackTrace()[2].getClassName();
      String className = fullClassName.substring(fullClassName.lastIndexOf(".") + 1);
      String methodName = Thread.currentThread().getStackTrace()[2].getMethodName();
      int lineNumber = Thread.currentThread().getStackTrace()[2].getLineNumber();
      Logger Log = Logger.getLogger(className);
      Log.log(level, className + "." + methodName + "():" + lineNumber + "    : " +  message);
    }
 }
 public static void info(Object message) {
    if (DEBUG) {
      String fullClassName = Thread.currentThread().getStackTrace()[2].getClassName();
      String className = fullClassName.substring(fullClassName.lastIndexOf(".") + 1);
      String methodName = Thread.currentThread().getStackTrace()[2].getMethodName();
      int lineNumber = Thread.currentThread().getStackTrace()[2].getLineNumber();
      Logger Log = Logger.getLogger(className);
      Log.log(Level.INFO, className + "." + methodName + "():" + lineNumber + "    : " +  message);
    }
 }
 public static void warning(Object message) {
    if (DEBUG) {
      String fullClassName = Thread.currentThread().getStackTrace()[2].getClassName();
      String className = fullClassName.substring(fullClassName.lastIndexOf(".") + 1);
      String methodName = Thread.currentThread().getStackTrace()[2].getMethodName();
      int lineNumber = Thread.currentThread().getStackTrace()[2].getLineNumber();
      Logger Log = Logger.getLogger(className);
      Log.log(Level.WARNING, className + "." + methodName + "():" + lineNumber + "    : " +  message);
    }
 }
 public static void fine(Object message) {
    if (DEBUG) {
      String fullClassName = Thread.currentThread().getStackTrace()[2].getClassName();
      String className = fullClassName.substring(fullClassName.lastIndexOf(".") + 1);
      String methodName = Thread.currentThread().getStackTrace()[2].getMethodName();
      int lineNumber = Thread.currentThread().getStackTrace()[2].getLineNumber();
      Logger Log = Logger.getLogger(className);
      Log.log(Level.FINE, className + "." + methodName + "():" + lineNumber + "    : " +  message);
    }
 }
 
 public static void finer(Object message) {
    if (DEBUG) {
      String fullClassName = Thread.currentThread().getStackTrace()[2].getClassName();
      String className = fullClassName.substring(fullClassName.lastIndexOf(".") + 1);
      String methodName = Thread.currentThread().getStackTrace()[2].getMethodName();
      int lineNumber = Thread.currentThread().getStackTrace()[2].getLineNumber();
      Logger Log = Logger.getLogger(className);
      Log.log(Level.FINER, className + "." + methodName + "():" + lineNumber + "    : " +  message);
    }
 }
 
 public static void finest(Object message) {
    if (DEBUG) {
      String fullClassName = Thread.currentThread().getStackTrace()[2].getClassName();
      String className = fullClassName.substring(fullClassName.lastIndexOf(".") + 1);
      String methodName = Thread.currentThread().getStackTrace()[2].getMethodName();
      int lineNumber = Thread.currentThread().getStackTrace()[2].getLineNumber();
      Logger Log = Logger.getLogger(className);
      Log.log(Level.FINEST, className + "." + methodName + "():" + lineNumber + "    : " +  message);
    }
 }
 
 public static void severe(Object message) {
    if (DEBUG) {
      String fullClassName = Thread.currentThread().getStackTrace()[2].getClassName();
      String className = fullClassName.substring(fullClassName.lastIndexOf(".") + 1);
      String methodName = Thread.currentThread().getStackTrace()[2].getMethodName();
      int lineNumber = Thread.currentThread().getStackTrace()[2].getLineNumber();
      Logger Log = Logger.getLogger(className);
      Log.log(Level.SEVERE, className + "." + methodName + "():" + lineNumber + "    : " +  message);
    }
 }
 
 public static void config(Object message) {
    if (DEBUG) {
      String fullClassName = Thread.currentThread().getStackTrace()[2].getClassName();
      String className = fullClassName.substring(fullClassName.lastIndexOf(".") + 1);
      String methodName = Thread.currentThread().getStackTrace()[2].getMethodName();
      int lineNumber = Thread.currentThread().getStackTrace()[2].getLineNumber();
      Logger Log = Logger.getLogger(className);
      Log.log(Level.CONFIG, className + "." + methodName + "():" + lineNumber + "    : " +  message);
    }
 }
 
 public static void off(Object message) {
    if (DEBUG) {
      String fullClassName = Thread.currentThread().getStackTrace()[2].getClassName();
      String className = fullClassName.substring(fullClassName.lastIndexOf(".") + 1);
      String methodName = Thread.currentThread().getStackTrace()[2].getMethodName();
      int lineNumber = Thread.currentThread().getStackTrace()[2].getLineNumber();
      Logger Log = Logger.getLogger(className);
      Log.log(Level.OFF, className + "." + methodName + "():" + lineNumber + "    : " +  message);
    }
 }
 
 public static void all(Object message) {
    if (DEBUG) {
      String fullClassName = Thread.currentThread().getStackTrace()[2].getClassName();
      String className = fullClassName.substring(fullClassName.lastIndexOf(".") + 1);
      String methodName = Thread.currentThread().getStackTrace()[2].getMethodName();
      int lineNumber = Thread.currentThread().getStackTrace()[2].getLineNumber();
      Logger Log = Logger.getLogger(className);
      Log.log(Level.ALL, className + "." + methodName + "():" + lineNumber + "    : " +  message);
    }
 }
}
