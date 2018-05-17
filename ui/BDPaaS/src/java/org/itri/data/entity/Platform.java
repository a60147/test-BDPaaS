/*
    Author     : MuKai Huang
    Copyright (c) 2018 ITRI
 */
package org.itri.data.entity;

/**
 *
 * @author A40385
 */
public class Platform {
    private String type;
    private String url;
    private String projectName;
    private String userID;
    public Platform(String projectName, String type, String url){
        this.projectName = projectName;
        this.type = type;
        this.url = url;
        this.userID = "";
    }
    public Platform(String projectName, String type, String url, String userID){
        this.projectName = projectName;
        this.type = type;
        this.url = url;
        this.userID = userID;
    }
    public String getProjectName(){
        return this.projectName;
    }
    public String getType(){
        return this.type;
    }
    public String getURL(){
        return this.url;
    }
    public String getUserID(){
        return this.userID;
    }
}
